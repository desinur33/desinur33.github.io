const idbPromised = idb.open('footballd_database3', 1, upgradedDb => {
    if (!upgradedDb.objectStoreNames.contains('footballd3')) {
        upgradedDb.createObjectStore("footballd3", {keyPath: "id"});
    }
});

const dbGetAllData = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("footballd3", `readonly`);
            return transaction.objectStore("footballd3").getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Favorite not Found"))
            }
        })
    })
};

const dbSaveData = data => {    
    idbPromised
      .then(function(db) {        
          const tx = db.transaction("footballd3", "readwrite");
          const store = tx.objectStore("footballd3");
          console.log(data);
          store.put(data);
          return tx.complete;
      })
      .then(function() {
        M.toast({html : "Item Saved"});    
      })
      .catch((err) => {
      console.error('Item tidak berhasil disimpan', err); 
    });

}

const getTeamById = id => {
    return new Promise(function(resolve, reject) {
      idbPromised
        .then(function(db) {
          let tx = db.transaction("footballd3", "readonly");
          let store = tx.objectStore("footballd3");
          return store.get(parseInt(id));
        })
        .then(function(data) {
            console.log(data);
            resolve(data);
           
        });
    });
  }
  

const dbdeleteTeam = id => {
    idbPromised.then(function(db) {
        let tx = db.transaction('footballd3', 'readwrite');
        let store = tx.objectStore('footballd3');
        store.delete(parseInt(id));
        return tx.complete;
      }).then(function() {
        M.toast({html: 'Item Deleted!'})
        console.log("data dihapus");
        getSavedTeam();
      });
  }