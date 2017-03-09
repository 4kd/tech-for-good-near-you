module Model exposing (..)

import Http
import Geolocation
import Time exposing (..)
import Date exposing (..)


-- TODO: Change post and selectedDate to Maybes


type alias Model =
    { postcode : String
    , selectedDate : String
    , events : List Event
    , userLocation : Maybe Coords
    , currentDate : Maybe Date
    }


type alias Event =
    { name : String
    , description : String
    , url : String
    , time : Date
    , address : String
    , venueName : String
    , lat : Float
    , lng : Float
    , rsvpCount : Int
    , groupName : String
    }


type alias Coords =
    { lat : Float
    , lng : Float
    , accuracy : Float
    }


type alias Marker =
    { url : String
    , description : String
    , lat : Float
    , lng : Float
    }


type Msg
    = SetPostcode String
    | SetDate String
    | GetEvents
    | Events (Result Http.Error (List Event))
    | GetLocation
    | Location (Result Geolocation.Error Geolocation.Location)
    | CurrentDate Time
