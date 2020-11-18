 // REGISTER SERVICE WORKER
 if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function() {
          console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
          console.log("Pendaftaran ServiceWorker gagal");
        });
    });
  } else {
    console.log("ServiceWorker belum didukung browser ini.");
  }

  const btn = document.querySelector("#save");

        // function untuk menyelipkan parameter di url
  function changeUrl () {
  const urlParams = window.location.search;
  const params = new URLSearchParams(urlParams.slice(1));
  params.append('saved', true);
  window.history.replaceState({}, '', `${location.pathname}?${params}`);
  }

  save.addEventListener('click', function () {
    getTeamDescById().then(teamsave => {
      dbSaveData(teamsave);
      changeUrl();
      })
      btn.style.display = 'none';
  })

 document.addEventListener("DOMContentLoaded", function() {
  const urlSavedParams = new URLSearchParams(window.location.search);
  const isFromSaved = urlSavedParams.get("saved")

   if(isFromSaved){
     btn.style.display = 'none';
     getSavedTeamById();
   }else{
    getTeamDescById()
   }
  });

