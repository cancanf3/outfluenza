# -*- coding: utf-8 -*-
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from classes.MangoHacksClasses import *
from classes.BetterDoctor import BetterDoctor
from classes.middleman import *
import requests

class MangoHacksView(APIView):

    def post(self, request):
        gps = request.data
        objects = getNClosestTweets(float(gps['latitude']), float(gps['longitude']), 20)
        return Response(objects)

@api_view(['POST'])
def getDoctors(request):
    gps = request.data
    doctors = BetterDoctor(float(gps['latitude']), float(gps['longitude'])).getDoctor()

    return Response(doctors)

@api_view(['POST'])
def getMostRecentCDC(request):
    url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + str(request.data['latitude']) + ',' + str(request.data['longitude']) + '&sensor=true&key=' + 'AIzaSyDYXLym9KjBK9xmcoDfTVjpZ24RJwYpZmg'

    data = requests.get(url).text
    dataO = json.loads(data)
    state = 'California'
    postal =''
    for event in dataO['results'][0]['address_components']:
        if event['types'][0] == 'administrative_area_level_1':
            state = event['long_name']
        if event['types'][0] == 'postal_code':
            postal = event['long_name']


    objects = getMostRecentCdcData(state)
    objects['postal'] = postal
    print(objects)
    return Response(objects)

@api_view(['POST'])
def getGoogleTrendData(request):
    url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + str(request.data['latitude']) + ',' + str(request.data['longitude']) + '&sensor=true&key=' + 'AIzaSyDYXLym9KjBK9xmcoDfTVjpZ24RJwYpZmg'

    data = requests.get(url).text
    dataO = json.loads(data)
    state = 'California'
    country = 'Country'
    for event in dataO['results'][0]['address_components']:
        if event['types'][0] == 'administrative_area_level_1':
            state = event['short_name']
        elif event['types'][0] == 'country':
            country = event['short_name']


    objects = getGoogleTrendData2(country+'-'+state)
    print(objects)
    return Response(objects)

@api_view(['POST'])
def getGeoLocation(request):
    print("ESTE")
    print(request.data)
    url = 'https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:'+str(request.data['zipcode'])+ '&sensor=true&key=' + 'AIzaSyDYXLym9KjBK9xmcoDfTVjpZ24RJwYpZmg'

    return Response(json.loads(requests.get(url).text)['results'][0]['geometry']['location'])
