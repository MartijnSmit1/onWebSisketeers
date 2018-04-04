import * as firebase from 'firebase';

console.log('Functions active.');

function getFB(ref) {
	return firebase.database().ref(ref ? ref : '/');
}

function getQuizRef(ref) {
	var quizRef;

	quizRef = getFB('/quizzen');
	return quizRef;
}

function getQuizFromId(ref, cb) {
	ref.on('value', snapshot => cb(snapshot));
}

function test() {
	return 'Works';
}

function updateQuizQuestions(id, questions) {
	var trefq = firebase.database().ref('/quizzen/'+id+'/vragen/');

	trefq.on('value', snapshot => {
		console.log('UPDATING QUESTIONS....');
		trefq.off('value');
		var ind = 0;

		var sv = snapshot.val();

		if (sv !== null) {
			ind = sv.length;
		} else {
			ind = 0;
		}

		if (ind == undefined) {
			ind = 0;
		} else if (ind >= 10) {
			ind = 0;
		}

		var qe = questions;
		questions = {};
		questions[ind] = qe;


		trefq.update(questions);
	});
}

function createQuiz(titel, beschrijving, cb) {
	var tref = firebase.database().ref('/quizzen/');

	tref.on('value', snapshot => {
		tref.off('value');
		console.log('Creating quiz '+titel+'... please wait.');
		var ind = 0;
		var sv = snapshot.val();

		if (sv !== null) {
			ind = sv.length;
		} else {
			ind = 0;
		}

		if (ind == undefined) {
			ind = 0;
		} else if (ind >= 10) {
			ind = 0;
		}

		var uid = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

		var pack = {};
		pack[ind] = {
			"beschrijving" : beschrijving ? beschrijving : 'Beschrijving van de quiz',
			"id" : ind,
			"titel" : titel ? titel: 'Dit is de titel van de quiz',
			"vragen" : [],
			"uid" : uid
		};

		tref.update(pack, () => {cb(ind)});

	});
}

export { test, getFB, getQuizRef, getQuizFromId, createQuiz, updateQuizQuestions }
