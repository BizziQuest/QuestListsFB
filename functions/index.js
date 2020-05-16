const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/**
 * This function keeps a running count of all the lists.
 * 
 * WARNING: this function is gonna take an insanely long time after a few hundred
 *  lists are created. This is run every time a list config is updated, changed, or removed.
 *  Hopefully, we will have some sort of monetary support by then, so we can actually
 *  pay Firebase for real stuff. By then, though, we should really consider
 *  an alternative to this.
 */

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.countLists = functions.database.ref('/list_configs')
    .onWrite(event => {
      const lists = event.data.val();
      let count_path = event.data.ref.parent.child('list_count');

      count = Object.keys(lists).length;
      console.log('Updating counts:', count)
      // TODO: update counts for all users!

      return count_path.set(count);
    });