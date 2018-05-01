import requests
import json
import datetime
import math
import heapq

fluCall = 'http://flutrack.org/results.json'


def getNClosestTweets( lat1, lon1, n):

    r2 = requests.get(fluCall)
    events = json.loads(r2.text)


    R = 3959.0 #Radius of the Earth
    h = []
    existed = []
    count = 0
    for event in events:
        count = count + 1
        lon2 = float(event['longitude'])
        lat2 = float(event['latitude'])
        dlon = (lon2 - lon1)*math.pi/180
        dlat = (lat2 - lat1)*math.pi/180
        a = math.pow((math.sin(dlat/2)),2) + math.cos(lat1*math.pi/180) * math.cos(lat2*math.pi/180) *  math.pow((math.sin(dlon/2)),2)
        c = 2 * math.atan2( math.sqrt(a), math.sqrt(1-a) )
        d = R * c
        event['distance'] = d

        if d not in existed:
            existed.append(d)
            heapq.heappush(h, (d, event))

    output = []
    ostring = u'poopman'
    for i in range(0,20):
        temp = heapq.heappop(h)
        while(temp[1]['user_name'] == ostring):
            temp = heapq.heappop(h)
        ostring = temp[1]['user_name']
        temp[0]
        temp[1]
        output.append(temp[1])

    return {"total": count, "nearbyTweets":output}
