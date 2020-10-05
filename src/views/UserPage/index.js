import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactHowler from "react-howler";
import Button from "../../components/elements/Button";
import Video from "react-responsive-video";
import { auth } from "../../configs/firebase";
import { getCurrentUser } from "../../services/user";

import { useHistory } from "react-router-dom";

import logo from "./logo.svg";
import "./style.css";

function UserPage() {
  const baseMinutes = 0;
  const baseSeconds = 3;

  const myInterval = useRef();

  const history = useHistory();

  const [minutes, setMinutes] = useState(baseMinutes);
  const [seconds, setSeconds] = useState(baseSeconds);

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [currentIntervention, setCurrentIntervention] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [parsedInterventionList, setParsedInterventionList] = useState([]);

  const interventionsListMock = [
    {
      id: 0,
      slug: "water",
      message: "Beba água",
      file: require("../../assets/videos/water.mp4"),
    },
    {
      id: 1,
      slug: "posture",
      message: "Corrija sua postura",
      file: require("../../assets/videos/posture.mp4"),
    },
    {
      id: 2,
      slug: "workPause",
      message: "Faça uma pausa no seu serviço",
      file: require("../../assets/videos/workPause.mp4"),
    },
    {
      id: 3,
      slug: "stress",
      message: "Medite por alguns minutos",
      file: require("../../assets/videos/stress.mp4"),
    },
    {
      id: 4,
      slug: "pain",
      message: "Comece sua auto-massagem",
      file: require("../../assets/videos/pain.mp4"),
    },
    {
      id: 5,
      slug: "sedentary",
      message: "Pratique alguma atividade física",
      file: require("../../assets/videos/sedentary.mp4"),
    },
  ];

  const getAuthUserAsync = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user.interventions) {
      history.replace("questionario");
    }

    if (user.interventions) {
      const selectedInterventions = [];
      user.interventions.forEach((intervention) => {
        const data = interventionsListMock.filter(
          (i) => i.slug === intervention
        )[0];
        selectedInterventions.push(data);
      });
      console.log(selectedInterventions);
      setParsedInterventionList(selectedInterventions);
    }

    setAuthUser(user);
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getAuthUserAsync();
      } else {
        history.replace("entrar");
      }
    });
  }, []);

  useEffect(() => {
    if (isStarted && !isPaused) {
      myInterval.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds((seconds) => seconds - 1);
          document.title = `${minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
          }`;
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval.current);
          } else {
            setMinutes((minutes) => minutes - 1);
            setSeconds(59);
            document.title = `${minutes}:${
              seconds < 10 ? `0${seconds}` : seconds
            }`;
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(myInterval.current);
    };
  }, [seconds, isStarted, isPaused]);

  useEffect(() => {
    if (!minutes && !seconds) {
      setIsPlaying(true);
      document.title = "Realize a intervenção";
    } else {
      setIsPlaying(false);
    }
  }, [minutes, seconds]);

  const start = () => {
    setIsStarted(true);
  };

  const stop = () => {
    setIsStarted(false);
    setMinutes(baseMinutes);
    setSeconds(baseSeconds);
    setCurrentIntervention(0);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const nextIntervention = () => {
    if (currentIntervention < parsedInterventionList.length - 1) {
      setCurrentIntervention((currentIntervention) => currentIntervention + 1);
      setMinutes(baseMinutes);
      setSeconds(baseSeconds);
    } else {
      setCurrentIntervention(0);
      setMinutes(baseMinutes);
      setSeconds(baseSeconds);
    }
    setIsPlaying(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!minutes && !seconds ? (
          <Video
            mp4={parsedInterventionList[currentIntervention].file}
            style={{ maxWidth: "100%", width: "400px", marginTop: 120 }}
            objectFit={`contain`}
          />
        ) : (
          <img src={logo} className="mt-5" className="App-logo" alt="logo" />
        )}
        <h3>Olá, {authUser?.name.split(" ")[0]}</h3>
        {isStarted && (
          <>
            {!minutes && !seconds ? (
              <h1 className="mt-0">
                {parsedInterventionList[currentIntervention].message}
              </h1>
            ) : (
              <h1 className="mt-0">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </h1>
            )}
          </>
        )}
        {!isStarted && (
          <>
            <Button tag="a" color="primary" wideMobile onClick={start}>
              Iniciar intervenções
            </Button>
            <p className="mt-3">
              Clique no botão abaixo para iniciar as intervenções
            </p>
          </>
        )}
        {isStarted && (
          <div style={{ flexDirection: "column" }}>
            {minutes || seconds ? (
              isPaused ? (
                <div>
                  <Button
                    tag="a"
                    color="secondary"
                    style={{ width: "100%" }}
                    wideMobile
                    onClick={resume}
                  >
                    Despausar
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    tag="a"
                    style={{ width: "100%" }}
                    wideMobile
                    onClick={pause}
                  >
                    Pausar
                  </Button>
                </div>
              )
            ) : (
              <div>
                <Button
                  tag="a"
                  color="primary"
                  wideMobile
                  onClick={nextIntervention}
                >
                  Iniciar a próxima intervenção
                </Button>
              </div>
            )}
            <div>
              <Button
                tag="a"
                wideMobile
                onClick={stop}
                style={{ marginTop: 10, width: "100%" }}
              >
                Parar
              </Button>
            </div>
            <Button
              tag="a"
              color="primary"
              wideMobile
              style={{ opacity: 0 }}
              onClick={nextIntervention}
            >
              Iniciar a próxima intervenção
            </Button>
          </div>
        )}
        <ReactHowler
          src="https://comercio.facilitusapp.com/bell.mp3"
          playing={isPlaying}
        />
      </header>
    </div>
  );
}

export default UserPage;
