targetDate=20140628
numDays=1
jsonParams='"date":'$targetDate',"daysForData":'$numDays
curl -X POST   -H "X-Parse-Application-Id: UjD956TYrxLbL58UwNqiSSaHcUBiSp4gs3S0oV5Q"   -H "X-Parse-REST-API-Key: 3UnTlreVmT5HBYYX0zKn6sbm9Mlly5F9OGMarrhi"   -H "Content-Type: application/json"   -d '{'$jsonParams'}'   https://api.parse.com/1/functions/updateAPIData
