import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";

import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";

const CustomMarker = () => (
  <View style={styles.markerContainer}>
    <View style={styles.markerBubble}>
      <Icon name="flash" size={20} color="#fff" />
      <Text style={styles.chargerTypeText}>test</Text>
    </View>
    <View style={styles.markerArrow} />
  </View>
);

const chargers = [
  {
    id: "a001",
    name: "Expressway Charging - Mariam Enterprise",
    address: "Connaught Place, Delhi",
    distance: "2102",
    distance_metrics: "metres",
    latitude: 28.6315,
    longitude: 77.2167,
    connector_types: ["lvl1dc-2", "lvl2dc-1", "normalac-1"],
  },
  {
    id: "a002",
    name: "Downtown Charging Hub",
    address: "Khan Market, Delhi",
    distance: "1500",
    distance_metrics: "metres",
    latitude: 29.6275,
    longitude: 77.2273,
    connector_types: ["lvl1dc-1", "lvl2dc-1"],
  },
  {
    id: "a003",
    name: "City Center Charging",
    address: "CP Circle, Delhi",
    distance: "1200",
    distance_metrics: "metres",
    latitude: 26.6305,
    longitude: 76.2209,
    connector_types: ["lvl1dc-1", "lvl2dc-1", "lvl2dc-3"],
  },
];

type ChargerTypeDetails = {
  [key: string]: {
    icon: string;
    label: string;
  };
};

const chargerTypeDetails: ChargerTypeDetails = {
  "lvl1dc-1": { icon: "flash", label: "Level 1 DC (Single)" },
  "lvl1dc-2": { icon: "flash", label: "Level 1 DC (Double)" },
  "lvl2dc-1": { icon: "flash-outline", label: "Level 2 DC (Single)" },
  "lvl2dc-3": { icon: "flash", label: "Level 2 DC (Triple)" },
  "normalac-1": { icon: "battery-charging", label: "Normal AC" },
};

function HomeScreen() {
  const [search, setSearch] = useState("");

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const focusLocation = (latitude: number, longitude: number, id: string) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
    setSelectedCard(selectedCard === id ? null : id);
  };

  const renderChargerTypes = (types: string[]) => (
    <View style={styles.chargerTypesContainer}>
      {types.map((type, index) => (
        <View key={index} style={styles.chargerTypeItem}>
          <Icon name="flash" size={20} color="#fff" />
          <Text style={styles.chargerTypeText}>
            {chargerTypeDetails[type]?.label || type}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 28.6315,
          longitude: 77.2167,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {chargers.map((charger) => (
          <Marker
            key={charger.id}
            coordinate={{
              latitude: charger.latitude,
              longitude: charger.longitude,
            }}
            title={charger.name}
            description={`${charger.distance} ${charger.distance_metrics}`}
          >
            <CustomMarker />
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for compatible chargers"
          placeholderTextColor="#666"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <View style={styles.cardContainer}>
        <FlatList
          data={chargers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                focusLocation(item.latitude, item.longitude, item.id)
              }
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Icon
                  name={
                    selectedCard === item.id
                      ? "chevron-down"
                      : "chevron-forward"
                  }
                  size={20}
                  color="#4CAF50"
                />
              </View>
              <Text style={styles.cardSubtitle}>{item.address}</Text>
              <Text style={styles.cardDistance}>
                {item.distance} {item.distance_metrics} away
              </Text>
              <View style={styles.connectorContainer}>
                <Icon
                  name="flash"
                  size={16}
                  color="#4CAF50"
                  style={styles.connectorIcon}
                />
                <Text style={styles.cardConnectors}>
                  {item.connector_types.length} Charger Types Available
                </Text>
              </View>
              {selectedCard === item.id &&
                renderChargerTypes(item.connector_types)}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    width: 40,
    height: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#4CAF50",
    marginTop: -2,
  },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
  },
  cardContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get("window").height * 0.4,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1E1E1E",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  cardSubtitle: {
    color: "#888",
    marginTop: 5,
  },
  cardDistance: {
    color: "#4CAF50",
    marginTop: 5,
    fontSize: 14,
  },
  connectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  connectorIcon: {
    marginRight: 6,
  },
  cardConnectors: {
    color: "#888",
    flex: 1,
  },
  chargerTypesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  chargerTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  chargerTypeText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
  },
});
