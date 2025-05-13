import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";

const MAPTILER_API_KEY = "YOUR_MAPTILER_API_KEY"; // Thay API KEY đúng vào đây

export default function NewMapScreen() {
  const { setNewLocation } = useAppStore();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debounceRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkk',user);
  
  const getAddressFromCoords = async (coords) => {
    try {
      const [place] = await Location.reverseGeocodeAsync(coords);
      if (place) {
        const fullAddress = `${place.name || ""}, ${place.street || ""}, ${
          place.subregion || ""
        }, ${place.region || ""}, ${place.country || ""}`;
        console.log("Địa chỉ:", fullAddress);
        setNewLocation({
          address: fullAddress,
          latitude: coords.latitude,
          longitude: coords.longitude,
          name:'',
          phoneNumber:'',
        });
      }
    } catch (error) {
      console.error("Lỗi lấy địa chỉ:", error);
    }
  };
  const handleChangeText = (text) => {
    setQuery(text);

    // Debounce 2 giây
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocation(text);
    }, 2000);
  };
  const searchLocation = async (text) => {
    setQuery(text);
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }
  
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(text)}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)', // đổi theo bạn
          },
        }
      );
  
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Lỗi tìm kiếm địa chỉ:', error);
    }
  };
  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {region && (
        <>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập địa chỉ..."
              value={query}
              onChangeText={handleChangeText}
            />
            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const lat = parseFloat(item.lat);
                      const lon = parseFloat(item.lon);
                      const newRegion = {
                        latitude: lat,
                        longitude: lon,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      };
                      setRegion(newRegion);
                      setMarker({ latitude: lat, longitude: lon });
                      getAddressFromCoords({ latitude: lat, longitude: lon });
                      setSearchResults([]);
                      setQuery(item.display_name); // gán lại cho input
                    }}
                    style={styles.resultItem}
                  >
                    <Text>{item.display_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <MapView
            style={StyleSheet.absoluteFillObject}
            region={region}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
              getAddressFromCoords(e.nativeEvent.coordinate);
              console.log("Marker set at:", latitude, longitude); // In ra console
            }}
          >
            <UrlTile
              urlTemplate={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`}
              maximumZ={19}
            />
            {marker && <Marker coordinate={marker} />}
          </MapView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchWrapper: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
});
