$(document).ready(() => {
	const formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2,
	  // the default value for minimumFractionDigits depends on the currency
	  // and is usually already 2
	});
	let amountCol = $('.transaction_amount').get();
	amountCol.forEach((row) => {
		let amount = $(row).data('amount') / 100;
		$(row).prepend(formatter.format(amount));
	});
});

function log(s) {
	console.log(s);
}
