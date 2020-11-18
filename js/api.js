const API_KEY = "16d85bf702974259b17e4dff4faeade4";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_TEAMS = `${BASE_URL}teams/`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

const getAllStandings = () => {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

const showStanding = data => {
    let standings = "";
    let standingElement =  document.getElementById("klasemen");

    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td>${standing.position}</td>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

     standingElement.innerHTML = `
                <div class="row">
                <table class=" col s12 responsive-table">
                    <thead>
                        <tr>
                            
                            <th>Position</th>
                            <th>Image</th>
                            <th>Team Name</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}

const getAllTeam = () =>{
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Team Data: " + data);
                    showAllTeam(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showAllTeam(data);
        })
        .catch(error => {
            console.log(error)
        })
}

//ambil data team
const showAllTeam = data => {
    let teams = "";
    let teamsElement =  document.getElementById("team");

    data.standings[0].table.forEach(function (res) {
        teams += `
                <div class="col s12 m6">
                    <div class="card #fafafa grey lighten-5">
                        <div class="title-team">
                            <p>${res.team.name}</p>
                        </div>
                        <div>        
                            <img src="${res.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="110px" align="middle" alt="badge"/>
                        </div>
                        <a class="waves-effect waves-light btn blue-grey darken-4 btnteam" href="./desc.html?id=${res.team.id}">See More</i></a>
                    </div> 
                    
                </div>
                `;
    });

     teamsElement.innerHTML = `${teams}`;
}


const getTeamDescById = () => {
    return new Promise(function(resolve,reject){
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    console.log(idParam);

    if ("caches" in window) {
        caches.match(ENDPOINT_TEAMS+idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    //console.log(data);
                    console.log("Team Description Data: " + data);
                    showTeamDescById(data);
                    resolve(data);
                    
                })
            }
        })
    }

    fetchAPI(ENDPOINT_TEAMS+idParam)
        .then(data => {
            //console.log(data);
            showTeamDescById(data);
            resolve(data);

        })
        .catch(error => {
            console.log(error)
        })
    })
}

const showTeamDescById = data => {

    let teamsDescElement =  document.getElementById("body-content");

    let teamSquad=``

    data.squad.forEach(player => {
        //console.log(player)
        teamSquad += `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.nationality}</td>
                    <td>${player.position}</td>
                    <td>${player.role}</td>
                </tr>`;
    })

    let teamDesc=` <div class=" card-desc #fafafa grey lighten-5 ">
                    <div class="img-team">        
                        <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}"  alt="badge"/>
                    </div>
                    <div class="team-desc">
                        <h3>${data.name}</h3>
                        <strong> Address : ${data.address} </strong></br>
                        <strong> Phone : ${data.phone} </strong></br>
                        <strong> Website : ${data.website}</strong></br>
                        <strong> Email : ${data.email} </strong></br>
                        <strong> Founded : ${data.founded} </strong></br>
                        <strong> Club Colors : ${data.clubColors} </strong></br>
                        <strong> Venue : ${data.venue} </strong></br>
                    </div>
                    <div class="table-team">
                    <h4> Squad of ${data.name}</h4>
                    <table width="90%">
                    <thead>
                    <tr>
                        
                        <th>Player Name</th>
                        <th>Nationality</th>
                        <th>Postion</th>
                        <th>Role</th>
                    </tr>
                 </thead>
                 <tbody>
                 ${teamSquad}
                 </tbody>
                    </table>
                    </div>    
                    </div>`;
    teamsDescElement.innerHTML = `<div> ${teamDesc}  </div>`;

}

const getSavedTeam = () => {
    dbGetAllData().then(function (data) {
      //console.log(data);
      // Menyusun komponen card artikel secara dinamis
      let teamHTML = "";
      data.forEach(function(data) {
        teamHTML += `
                    <div class="col s12 m6 ">
                    <div class="team-saved #fafafa grey lighten-5">
                        <div class="title-team">
                            <span class="card-title truncate">${data.name}</span>
                        </div>
                        <div class="logo">        
                            <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" width="120px" align="middle" alt="badge"/>
                        </div>
                        <a class="waves-effect waves-light btn blue-grey darken-4 btnteam" href="./desc.html?id=${data.id}&saved=true">See More</i></a>
                        <a class="waves-effect waves-light btn blue-grey darken-4 removeTeam" id=${data.id} >Delete</i></a>
                    </div> 
                    
                </div>
                  `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #body-content
      document.getElementById("saved").innerHTML = teamHTML;

        let removeTeam = document.querySelectorAll(".removeTeam");
        for (let button of removeTeam){
            button.addEventListener("click",function(event){
            let idTeam = event.target.id;
            console.log(idTeam);
            dbdeleteTeam(idTeam);
            })
        }
    });
}

const getSavedTeamById = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    
    getTeamById(idParam).then(function(data) {
        console.log(idParam);
        //console.log(data);
        let teamSquad=``

    data.squad.forEach(player => {
        console.log(player)
        teamSquad += `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.nationality}</td>
                    <td>${player.position}</td>
                    <td>${player.role}</td>
                </tr>`;
    })

    let teamDesc=` <div class=" card-desc #fafafa grey lighten-5 ">
                    <div class="img-team">        
                        <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}"  alt="badge"/>
                    </div>
                    <div class="team-desc">
                        <h3>${data.name}</h3>
                        <strong> Address : ${data.address} </strong></br>
                        <strong> Phone : ${data.phone} </strong></br>
                        <strong> Website : ${data.website}</strong></br>
                        <strong> Email : ${data.email} </strong></br>
                        <strong> Founded : ${data.founded} </strong></br>
                        <strong> Club Colors : ${data.clubColors} </strong></br>
                        <strong> Venue : ${data.venue} </strong></br>
                    </div>
                    <div class="table-team">
                    <h4> Squad of ${data.name}</h4>
                    <table width="90%">
                    <thead>
                    <tr>
                        
                        <th>Player Name</th>
                        <th>Nationality</th>
                        <th>Postion</th>
                        <th>Role</th>
                    </tr>
                 </thead>
                 <tbody>
                 ${teamSquad}
                 </tbody>
                    </table>
                    </div>    
                    </div>`;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = teamDesc;
    });
  }