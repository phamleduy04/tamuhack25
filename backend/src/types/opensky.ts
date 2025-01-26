export type State = [
    string,      // icao24: Unique ICAO 24-bit address of the transponder in hex string representation
    string | null, // callsign: Callsign of the vehicle (8 chars), can be null
    string,      // origin_country: Country name inferred from the ICAO 24-bit address
    number | null, // time_position: Unix timestamp (seconds) for the last position update, can be null
    number,      // last_contact: Unix timestamp (seconds) for the last update in general
    number | null, // longitude: WGS-84 longitude in decimal degrees, can be null
    number | null, // latitude: WGS-84 latitude in decimal degrees, can be null
    number | null, // baro_altitude: Barometric altitude in meters, can be null
    boolean,     // on_ground: Boolean indicating if the position was retrieved from a surface position report
    number | null, // velocity: Velocity over ground in m/s, can be null
    number | null, // true_track: True track in decimal degrees, clockwise from north, can be null
    number | null, // vertical_rate: Vertical rate in m/s, can be null
    number[] | null, // sensors: IDs of the receivers, can be null
    number | null, // geo_altitude: Geometric altitude in meters, can be null
    string | null, // squawk: The transponder code aka Squawk, can be null
    boolean,     // spi: Whether flight status indicates special purpose indicator
    number,      // position_source: Origin of this state’s position (ADS-B, ASTERIX, MLAT, FLARM)
    number       // category: Aircraft category, represented by an integer value
];
