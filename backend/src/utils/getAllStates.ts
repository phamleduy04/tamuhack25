import { setFlightCache } from '../db/cache';
import type { State } from '../types/opensky';
import { getTailNumber } from '../utils/convertICAO24';

import openskyClient from '../apis/opensky';

const getAllStates = async () => {
    try {
        console.log('Fetching states..');
        const response = await openskyClient.get('/states/all');
        const flightData = await Promise.all(response.data.states.filter((state: State) => state[1] && state[1].startsWith('AAL')).map(async (state: State) => ({
            icao24: state[0],
            callsign: state[1]?.trim(),
            origin_country: state[2],
            time_position: state[3],
            last_contact: state[4],
            longitude: state[5],
            latitude: state[6],
            baro_altitude: state[7],
            on_ground: state[8],
            velocity: state[9],
            true_track: state[10],
            vertical_rate: state[11],
            sensors: state[12],
            geo_altitude: state[13],
            squawk: state[14],
            spi: state[15],
            position_source: state[16],
            category: state[17],
            tail_number: await getTailNumber(state[0]),
        })));
    
        await setFlightCache(JSON.stringify(flightData));
        console.log('saved states to database');
    }
   catch (e) { 
    console.error(e);
   }
};

export default getAllStates;