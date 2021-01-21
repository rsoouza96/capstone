import {
  Container,
  Info,
  Contact,
  Title,
  ContactTitle,
  GifTab,
  TitleDetailContact,
  ContainerStyle,
} from "./styled";
import ongPic from "../../images/ongPic.png";
import gif from "../../images/loading.gif";
import IdNotFound from "../page-not-found";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";
import { useParams } from "react-router-dom";
import TitleDetail from "../../components/detail-title-blue";

import Agendamento from "../../components/modal";

const AdPage = () => {
  const [ad, setAd] = useState(null);
  const [ong, setOng] = useState(null);
  const [geo, setGeo] = useState({ lat: 0, lng: 0 });
  const [wrongId, setWrongId] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://capstone4-kenzie.herokuapp.com/campaigns/${id}`)
      .then((res) => setAd(res.data))
      .catch((err) => setWrongId(true));
  }, []);

  useEffect(() => {
    if (ad !== null) {
      console.log(ad.userId);
      axios
        .get(`https://capstone4-kenzie.herokuapp.com/ngos/${ad.userId}`)
        .then((res) => setOng(...res.data));
    }
  }, [ad]);

  // const containerStyle = {
  //   width: `300px`,
  //   height: `300px`,
  //   borderRadius: "20px",
  // };

  const center = {
    lat: geo.lat,
    lng: geo.lng,
  };

  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  //Get lat and long
  Geocode.setApiKey("AIzaSyBj8LCYAcsyOtQ7TNihTnP7kPMOVhtnqV0");

  Geocode.setLanguage("pt");

  Geocode.enableDebug();

  const getLocation = (address) => {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setGeo({ lat: lat, lng: lng });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    ong !== null && getLocation(`${ong.adress}`);
  }, [ong]);
  console.log(ong);
  const isOng = localStorage.getItem("isOng");
  return (
    <Container>
      {ad && (ong !== null) & (ong !== undefined) ? (
        <>
          <Title>
            <h1>{ad.title}</h1>
            <TitleDetail />
          </Title>
          <Info>
            <img src={ongPic} alt="ONG" />
            <div className="data">
              <h2> {ong.name} </h2>
              <p> {ad.about} </p>
              {isOng === "false" && (
                <Agendamento
                  end={ad.endDate}
                  name={ad.ongName}
                  title={ad.title}
                  id={id}
                  ongId={ad.userId}
                />
              )}
            </div>
          </Info>
          <Contact
            style={{
              backgroundColor: isOng === "false" ? "#00BBF935" : "#90BE6D35",
            }}
          >
            <div className="contact-data">
              <ContactTitle>
                <h2>Contato</h2>
                <TitleDetailContact />
              </ContactTitle>
              <ul>
                {ong.email && <li> {ong.email} </li>}
                {ong.phoneNumber && <li> {ong.phoneNumber} </li>}
                <li>
                  <a href={ong.site}>{ong.site}</a>
                </li>
              </ul>
            </div>
            <div className="contact-map">
              <LoadScript googleMapsApiKey="AIzaSyBj8LCYAcsyOtQ7TNihTnP7kPMOVhtnqV0">
                <GoogleMap
                  mapContainerStyle={ContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker onLoad={onLoad} position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </Contact>
        </>
      ) : wrongId ? (
        <IdNotFound />
      ) : (
        <GifTab>
          <img src={gif} alt="loading" />
        </GifTab>
      )}
    </Container>
  );
};

export default AdPage;
