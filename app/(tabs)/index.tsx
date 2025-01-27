import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";

import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileModal from "@/components/ProfileModal";
import { captureRef } from "react-native-view-shot";
import styles from "@/assets/styles";

const CustomMarker = ({ count }: { count: number }) => (
  <View style={styles.markerContainer}>
    <View style={styles.markerBubble}>
      <Icon name="flash" size={20} color="#fff" />
    </View>
    <View> {count || ""}</View>
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
    connector_types: [
      "lvl1dc-2",
      "lvl2dc-1",
      "normalac-1",
      "lvl1dc-2",
      "lvl2dc-1",
      "normalac-1",
    ],
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
  const captureAndUploadMapshot = async () => {
    try {
      const uri = await captureRef(mapRef, {
        format: "png",
        quality: 0.8,
        result: "tmpfile",
      });
      console.log("Screenshot captured at:", uri);
    } catch (error) {
      console.error("Error capturing or uploading screenshot:", error);
    }
  };

  const renderChargerTypes = (types: string[]) => (
    <FlatList
      data={types}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item }) => (
        <View style={styles.chargerTypeItem}>
          <Icon name="flash" size={20} color="#fff" />
          <Text style={styles.chargerTypeText}>
            {chargerTypeDetails[item]?.label || item}
          </Text>
          <Text
            style={[styles.chargerTypeText, { flex: 1, textAlign: "right" }]}
          >
            {`${item?.split("-")[1]}X`}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 10 }}
      style={{ maxHeight: 150 }}
    />
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
            <CustomMarker count={charger.connector_types.length} />
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
      <View style={styles.profileContainer}>
        <ProfileModal />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={captureAndUploadMapshot}
        activeOpacity={0.8}
      >
        <Icon name="camera" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        <FlatList
          data={chargers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardwrapper}>
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
                    name="flash"
                    size={26}
                    color="#4CAF50"
                    style={styles.connectorIcon}
                  />
                </View>
                <Text style={styles.cardSubtitle}>{item.address}</Text>
                <Text style={styles.cardDistance}>
                  {item.distance} {item.distance_metrics} away
                </Text>
              </TouchableOpacity>
              <Text style={styles.cardTitle2}>SUPPORTED CONNECTORS</Text>

              <View style={styles.connectorContainer}>
                <Text style={styles.cardConnectors}>
                  {item.connector_types.length} Charger Types Available
                </Text>
              </View>
              <View>{renderChargerTypes(item.connector_types)}</View>
            </View>
          )}
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false} // Optional: Hide the horizontal scrollbar
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
    </View>
  );
}
export default HomeScreen;
