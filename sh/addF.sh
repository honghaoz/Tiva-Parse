#!/bin/bash -x
userID=cfoxfdSDpM
friendID=8184McnIsN

curl -X POST   -H "X-Parse-Application-Id: UjD956TYrxLbL58UwNqiSSaHcUBiSp4gs3S0oV5Q"   -H "X-Parse-REST-API-Key: 3UnTlreVmT5HBYYX0zKn6sbm9Mlly5F9OGMarrhi"   -H "Content-Type: application/json"   -d '{"userID":"'$userID'", "friendID":"'$friendID'"}'   https://api.parse.com/1/functions/addFriend

curl -X POST   -H "X-Parse-Application-Id: UjD956TYrxLbL58UwNqiSSaHcUBiSp4gs3S0oV5Q"   -H "X-Parse-REST-API-Key: 3UnTlreVmT5HBYYX0zKn6sbm9Mlly5F9OGMarrhi"   -H "Content-Type: application/json"   -d '{"userID":"'$friendID'", "friendID":"'$userID'"}'   https://api.parse.com/1/functions/addFriend
