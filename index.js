var discovery = require('discovery-swarm')
var hypercore = require('hypercore')
var pump = require('pump')

if( process.argv.length != 3 ) {
  console.log( "Usage" )
  console.log( "node dump.js cabalkey")
  process.exit(1)
 }

// Strip out the awesome
const key =  process.argv[2].replace('cabal://', '').replace('cbl://', '').replace('dat://', '').replace(/\//g, '')
//const key = 'c4a2a72e2df7867a4d9d0eeaf98e2930d6c3948f0c9087c34a09a2bcfbd69615';

console.log( "Connecting to", key)

// var feed = hypercore('./single-chat-feed-clone', '{paste the public key from the prev exercise}', {
var feed = hypercore('./received', key, {
  valueEncoding: 'json'
})

feed.createReadStream({ live: true})
  .on('data', function (data) {
    console.log(data)
  })
 
var swarm = discovery()

feed.ready(function () {
  // we use the discovery as the topic
  swarm.join(feed.discoveryKey)
  swarm.on('connection', function (connection) {
    console.log('(New peer connected!)')
    
    // We use the pump module instead of stream.pipe(otherStream)
    // as it does stream error handling, so we do not have to do that
    // manually.
    
    // See below for more detail on how this work.
    pump(connection, feed.replicate({ live: true }), connection)
  })
})
