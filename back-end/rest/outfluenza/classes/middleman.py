import requests
import json
import datetime
import math
import heapq
import ast
import datetime
import os
from pytrends.request import TrendReq



def getMostRecentCdcData(state):
    try:
        with open(os.path.join(os.path.dirname(__file__), './storedData/lastUpdate.txt'), "r") as f:
        # with open('/home/student/DataLions/Server/DataLionsAPI/rest/classes/storedData/lastUpdate.txt', 'r') as f:
            lastUpdateCdc= f.readline()
            print(lastUpdateCdc)
            lastUpdateDate = f.readline()
            datetimeCdc = datetime.datetime.strptime(lastUpdateCdc, '%b-%d-%Y\n')
            datetimeLastCheck = datetime.datetime.strptime(lastUpdateDate,'%b-%d-%Y')
            oneWeek = datetime.timedelta(weeks=0, days=7, hours=0, minutes=0, seconds=0)
            if(datetimeCdc.date() < (datetime.datetime.today()- oneWeek).date() and datetimeLastCheck.date() != datetime.datetime.today().date()):
                writeRecentCdcData()
            f.close()
    except:
        print("exception")
        writeRecentCdcData()

    latestFile = '1988-89.txt'
    for f in os.listdir(os.path.join(os.path.dirname(__file__), './storedData/i/')):
        if f > latestFile:
            latestFile = f

    fileContents = ''
    with open(os.path.join(os.path.dirname(__file__), './storedData/i/')+latestFile, 'r') as f:
        fileContents = f.read()
        f.close()

    dataset = json.loads(fileContents)

    maxWeek = -1000
    for week in dataset:
        current = int(week)
        if(current>= 40):
            current-=52
        if(current>maxWeek):
            maxWeek = current

    if maxWeek<0:
        maxWeek+=52

    dataset[str(maxWeek)][state]
    return dataset[str(maxWeek)][state]


def writeRecentCdcData():

    print("Writing CDC DATA . . . ")
    r2 = requests.get('https://gis.cdc.gov/grasp/fluView1/Phase1DownloadDataP/2017-2018')

    literal = ast.literal_eval(r2.text)
    events = json.loads(literal)
    events = events['datadownload']

    dataset = {}
    for event in events:
        if dataset.get(event[u'season']) == None:
            dataset[event[u'season']] = {event[u'weeknumber']:{event[u'statename']:event}}
        elif dataset[event[u'season']].get(event[u'weeknumber']) == None:
            dataset[event[u'season']][event[u'weeknumber']] = {event[u'statename']:event}
        elif dataset[event[u'season']][event[u'weeknumber']].get(event[u'statename']) == None:
            dataset[event[u'season']][event[u'weeknumber']][event[u'statename']] = event
        else:
            dataset[event[u'season']][event[u'weeknumber']][event[u'statename']] = event

    dataset["2017-18"]["4"]["Florida"]

    maxSeason= "1994-05"
    for season in dataset:
        season.encode('ascii','ignore')
        if season > maxSeason:
            maxSeason = season
        with open(os.path.join(os.path.dirname(__file__), './storedData/i/') + season +'.txt', 'w') as f:
            f.write(json.dumps(dataset[season]))
            f.close()

    maxWeek = -1000
    for week in dataset[maxSeason]:
        current = int(week)
        if(current>= 40):
            current-=52
        if(current>maxWeek):
            maxWeek = current

    if maxWeek<0:
        maxWeek+=52

    with open(os.path.join(os.path.dirname(__file__), './storedData/lastUpdate.txt'), 'w') as f:
        f.write(dataset[maxSeason][str(maxWeek)]["Florida"]['weekend']+"\n")
        f.write(datetime.datetime.today().strftime('%b-%d-%Y'))
        f.close()

    return

def getGoogleTrendData2(geoCode):
    pytrend = TrendReq(hl='en-US', tz=360)
    kw_list=['flu']

    pytrend.build_payload(kw_list, cat=0, timeframe='today 1-m', geo=geoCode, gprop='')

    output = pytrend.interest_by_region(resolution='CITY')
    return output.to_dict()
