const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

router.get('/', (req, res, next) => {
	res.redirect(`/${req.version}/config`)
})

function createBusinessList(l, i) {
	let x = Array.from({length: i}, () => Math.floor(Math.random() * l)).sort((a, b) => a - b)
	return x
}

router.post('/config', (req, res, next) => {
	req.session.data['random-businesses'] = createBusinessList(req.session.data['businesses'].length, req.session.data['orgs-count'])
	res.redirect('dashboard')
})

router.get('/organisations', (req, res, next) => {
	if(! req.session.data['random-businesses']){
		req.session.data['random-businesses'] = createBusinessList(req.session.data['businesses'].length, req.session.data['orgs-count'])
	}

	res.render(`${req.version}/organisations`)
})

router.post('/search', (req, res, next) => {
	res.redirect('search-results')
})

router.post('/confirm-delete', (req, res, next) => {
	if(req.session.data['confirm-delete'] == 'yes'){
		res.redirect('delete-details')
	} else if(req.session.data['confirm-delete'] == 'no'){
		res.redirect('certificate')
	} else {
		res.redirect('confirm-delete--errors')
	}
})

router.post('/delete-details', (req, res, next) => {
	let ref = req.session.data['delete-certificate']['ticket-reference']
	let reason = req.session.data['delete-certificate']['reason']

	if(ref.length && reason.length){
		res.redirect('check-answers')
	} else {
		req.session.data['delete-certificate']['error-list'] = []
		let errorList = req.session.data['delete-certificate']['error-list']

		if(!ref.length){
			errorList.push({
				text: "Enter the relevant Zendesk ticket number or Servicenow incident number",
				href: "#passport-issued-error"
			})
		}

		if(!reason.length){
			errorList.push({
				text: "Enter the reason for deleting this certificate from the database",
				href: "#passport-issued-error"
			})
		}

		res.redirect('delete-details--errors')
	}
})

router.post('/check-answers', (req, res, next) => {
	delete req.session.data['delete-certificate']
	res.redirect('delete-success')
})