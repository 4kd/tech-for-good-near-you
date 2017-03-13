module Radius exposing (..)

import Test exposing (..)
import Expect
import Data.Location.Radius exposing (..)
import Model exposing (..)


suite : Test
suite =
    describe "getDistanceFromLatLngInMiles should"
        [ test "should convert two pairs of lat lngs to a distance in miles" <|
            \_ ->
                let
                    c1 =
                        Coords 51.464967 0.127023

                    c2 =
                        Coords 51.529902 0.042044

                    actual =
                        getDistanceFromLatLngInMiles c1 c2
                in
                    Expect.equal (round actual) 6
        ]
