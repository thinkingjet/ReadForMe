function goSomewhere(x){
  location = x;
}
function signup(){
  var username = document.getElementById('email').value
  username = username.replace(/>/g,"›")
  username = username.replace(/</g,"‹")
  var password = document.getElementById('password').value
  var name = document.getElementById('name').value
  name = name.replace(/>/g,"›")
  name = name.replace(/</g,"‹")
  if(username && password && name){
    db.collection("users")
    .where("username","==",username)
    .get()
    .then(function (snapshot){
      if(snapshot.empty){
        db.collection("users")
        .add({
          username: username,
          password: CryptoJS.SHA256(password).toString(),
          name: name,
          rememberedpeople: [],
          type: ""
        })
        .then(function (snapshot){
          localStorage.setItem("userToken",snapshot.id)
          localStorage.setItem("type","")
          location = "ReadForMebrowse.html"
        })
      }else{
        return
      }
    })
  }else{
    alert("Oh No! You didn't fill all of the inputs!")
  }
}
function login() {
  var username = document.getElementById('usernamer').value
  username = username.replace(/>/g,"‹")
  username = username.replace(/</g,"›")
  var password = CryptoJS.SHA256(document.getElementById('passwordr').value).toString()
  db.collection('users')
  .where("username","==",username)
  .where("password","==",password)
  .get()
  .then(function(snapshot){
    if(!snapshot.empty){
      localStorage.setItem("userToken",snapshot.docs[0].id)
      localStorage.setItem("type",snapshot.docs[0].data().type)
    location = "ReadForMebrowse.html"
    }else{
      document.getElementById('warning').innerHTML = "<h1>User Doesn't Exist<h1>"
    }
  })
}
function hub(){
  db.collection("users")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    if(!(snapshot.empty)){
      for(i = 0;i < snapshot.data().rememberedpeople.length;i++){
        db.collection("users")
        .doc(snapshot.data().rememberedpeople[i])
        .get()
        .then(function (snapshot){
          var h3 = document.createElement("h3");
          h3.innerText = snapshot.data().name
          var p = document.createElement("p");
          p.innerText = snapshot.data().description
          var div = document.createElement("div")
          div.style["border"] = "solid 0.5px";
          div.style["padding"] = "10px";
          div.style["margin"] = "10px";
          div.style["width"] = "300px";
          div.style["cursor"] = "pointer";
          div.style["overflow"] = "auto";
          div.setAttribute("onClick","goSomewhere(\"ReadForMe.html?id="+snapshot.id+"\")")
          div.appendChild(h3)
          div.appendChild(p)
          document.getElementById("remembered").appendChild(div)
        })

      }
    }else{
      document.getElementById("ownedlinxes").innerHTML = "<p><i>*Cricket*Cricket</i><br>Their aren't any volunteers you remembered!</p>";
    }
  })
}
function linxsearch(x){
  var search = document.getElementById("search").value
  db.collection('users')
  .where("name",">=",search)
  .get()
  .then(function (snapshot){
    if(!(snapshot.empty)){
      document.getElementById("everything").innerHTML = ""
      for(i=0;i < snapshot.docs.length;i++){
        if(snapshot.docs[i].data().type == "volunteer"){
          var h3 = document.createElement("h3");
          h3.innerHTML = snapshot.docs[i].data().name
          var p = document.createElement("p");
          p.innerHTML = (snapshot.docs[i].data().description)
          var div = document.createElement("div")
          div.style["border"] = "solid 0.5px";
          div.style["padding"] = "10px";
          div.style["margin"] = "10px";
          div.style["width"] = "300px";
          div.style["cursor"] = "pointer";
          div.style["overflow"] = "auto";
          div.setAttribute("onClick","goSomewhere(\"ReadForMe.html?id="+snapshot.docs[i].id+"\")")
          div.appendChild(h3)
          div.appendChild(p)
          document.getElementById("everything").appendChild(div)
        }
      }
    }else{
      document.getElementById("everything").innerHTML = `<i><pre>Echo! Echo!
      There seems to be no books that match that search.</pre></i>`
    }
  })
}
function linxconfirm(){
  var url = new URL(location.href);
  var id = url.searchParams.get("id");
  console.log(id)
  db.collection("groups")
  .where("id","==",id)
  .get()
  .then(function (snapshot){
    if(!(snapshot.empty)){
      document.getElementById("name").innerText = snapshot.docs[0].data().name
      document.getElementById("image").src = snapshot.docs[0].data().logo
      document.getElementById("confirm").setAttribute("onClick","linxbuttonconfirm('"+id+"')")
    }else{
      location = "https://example.com"
    }
  })
}
function linxbuttonconfirm(x){
  db.collection("groups")
  .doc(x)
  .get()
  .then(function (snapshot){
    db.collection("groups")
    .doc(x)
    .update({
      members: localStorage.getItem("userToken")
    })
    .then(function (snapshot){
      db.collection("users")
      .doc(localStorage.getItem("userToken"))
      .get()
      .then(function (snapshot){
        var attending = snapshot.data().roomsin
        attending.push(x)
        db.collection("users")
        .doc(localStorage.getItem("userToken"))
        .update({
          roomsin: attending
        })
        .then(function (snapshot){
          goSomewhere("ReadForMe.html?id="+x)
        })
      })
    })
  })
}
function signout(){
  localStorage.clear()
  location = "";
}
  function volunteersignup(namer,usernamer,password,email,mon,tue,wed,thu,fri,sat,sun,description,age){
  var username = usernamer.replace(/>/g,"›")
  username = username.replace(/</g,"‹")
  var name = namer.replace(/>/g,"›")
  name = name.replace(/</g,"‹")
    db.collection("users")
    .where("username","==",username)
    .get()
    .then(function (snapshot){
      if(snapshot.empty){
        db.collection("users")
        .add({
          username: username,
          name: name,
          password: CryptoJS.SHA256(password).toString(),
          name: name,
          type: "volunteer",
          monday: mon,
          tuesday: tue,
          wednesday: wed,
          thursday: thu,
          friday: fri,
          saturday: sat,
          sunday: sun,
          description: description,
          age: parseInt(age)
        })
        .then(function (snapshot){
          window.location = `mailto:`+email+`?subject=ReadForMe%20Team&body=%3C!DOCTYPE%20html%3E%0D%0A%3Chtml%3E%0D%0A%3Ccenter%3E%0D%0A%3Ch1%20style%3D%22font-family%3Asans-serif%3B%22%3E%F0%9F%8E%89You're%20In!%F0%9F%8E%89%3C%2Fh1%3E%0D%0A%3Cp%20style%3D%22font-family%3Asans-serif%3B%22%3ECongratulations!%20You%20are%20the%20newest%20official%20ReadForMe%20volunteer!%3C%2Fp%3E%0D%0A%3Cp%20style%3D%22font-family%3Asans-serif%3B%22%3ELet's%20go%20change%20some%20kid's%20lives%3C%2Fp%3E%0D%0A%3Ca%20href%3D%22https%3A%2F%2FReadForMe.kenjiw360.repl.co%2Fmain%2Fsignup.html%22%20style%3D%22font-weight%3Abold%3Bcolor%3Agrey%3Bfont-family%3Asans-serif%3B%22%3EClick%20Here%20to%20go%20to%20the%20volunteer%20login.%20Use%20the%20credentials%20you%20sent%20us%3C%2Fa%3E%0D%0A%3C%2Fcenter%3E%0D%0A%3C%2Fhtml%3E%60`
        })
      }else{
        alert("that volunteer already exists")
      }
    })
}
function ReadForMe(){
  var url = new URL(location.href);
  var id = url.searchParams.get("id");
  db.collection("users")
  .doc(id)
  .get()
  .then(function (snapshot){
    document.getElementById("name").innerText = snapshot.data().name
    document.getElementById("description").innerText = snapshot.data().description
    document.getElementById("monday").innerText = snapshot.data().monday
    document.getElementById("tuesday").innerText = snapshot.data().tuesday
    document.getElementById("wednesday").innerText = snapshot.data().wednesday
    document.getElementById("thursday").innerText = snapshot.data().thursday
    document.getElementById("friday").innerText = snapshot.data().friday
    document.getElementById("saturday").innerText = snapshot.data().saturday
    document.getElementById("sunday").innerText = snapshot.data().sunday
  })
}

function remember(){
  var url = new URL(location.href);
  var id = url.searchParams.get("id");
  db.collection("users")
  .doc(localStorage.getItem("userToken"))
  .get()
  .then(function (snapshot){
    var remembered = snapshot.data().rememberedpeople
    if(remembered.includes(id)){
      document.getElementById("remember").innerText = "✔ Remembered";
      return
    }
    remembered.push(id)
    db.collection("users")
    .doc(localStorage.getItem("userToken"))
    .update({
      rememberedpeople: remembered
    })
    .then(function (snapshot){
      document.getElementById("remember").innerText = "✔ Remembered";
    })
  })
}