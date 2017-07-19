var request = require('request')


exports.search = function(query, callback) {
  console.log('search')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, response:{status:'error', message:'No word for query'}})
  }

  const url = 'https://www.googleapis.com/places/name&location&types&rating'
  const query_string = {q: query, maxResults: 40, fields: 'items(id,volumeInfo(title,authors))'}
  request.get({url: url, qs: query_string}, function(err, res, body) {	//body is a string
    if (err) {
    	console.log('Google Search failed')
      return callback({code:500, response:{status:'error', message:'Search failed', data:err}})
    }

    const json = JSON.parse(body)	//convert body to object
    const items = json.items
    if (items){
	    const places = items.map(function(element) {
	      return {id:element.id, volumeInfo:{title:element.volumeInfo.title, authors:element.volumeInfo.authors}}
	    })
	    console.log(places.length +' places found')
	    callback({code:200, response:{status:'success', message:books.length+' places found', data:books}})
    }
    else
    	callback({code:204, response:{status:'error', message:'No places found', data:''}})
  })
}


