export const formatDate = (timeStamp: firebase.firestore.Timestamp) => {
	console.log(timeStamp, typeof timeStamp);
	const date = timeStamp.toDate();

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
