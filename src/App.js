import logo from "./logo.svg";
import "./App.css";
import TextField from "@mui/material/TextField";
import { Box, Stack, OutlinedInput, Typography } from "@mui/material";
import Button from "@mui/material/Button";
// import SendIcon from "@mui/icons-material/Send";
import React, { useState, useEffect, useRef } from "react";
import SliderValueLabel from "@mui/material/Slider/SliderValueLabel";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [callApi, setCallApi] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastResultRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (callApi) {
        try {
          setLoading(true);
          const response = await fetch(
            `http://192.168.29.96:5000/?input=${inputValue}`
          );
          const result = await response.json();
          setData((oldArray) => [...oldArray, result]);
          setCallApi(false);
          setInputValue("");
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [callApi]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    if (inputValue) {
      setCallApi(true);
    } else {
      setCallApi(false);
    }
  };

  useEffect(() => {
    // Scroll to the new result when data changes
    if (lastResultRef.current) {
      lastResultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <div className="App">
      {loading ? (
        <Box
          style={{
            margin: "auto",
            position: "absolute",
            zIndex: "1",
            top: "50%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
      <Box className="mainContainer">
        <Stack style={{ gap: "10px", height: "90vh", marginTop: "9px" }}>
          {data.map((value, index) => (
            <Stack
              className="container_one"
              ref={index === data?.length - 1 ? lastResultRef : null}
            >
              <Stack style={{ width: "90%", marginTop: "15px" }}>
                <Typography style={{ fontSize: "large", fontWidth: "600" }}>
                  You
                </Typography>
                <Typography className="owner_text scroll_display">
                  {value?.input}
                </Typography>
              </Stack>

              <Stack
                style={{
                  width: "90%",
                  marginTop: "0px",
                  paddingBottom: "24px",
                }}
                className="response_container"
              >
                {value ? (
                  <Typography className="ai_text scroll_display">
                    {value?.output}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Stack className="input">
        <OutlinedInput
          value={inputValue}
          onChange={handleChange}
          className="__input"
          name="title"
          placeholder="Enter text"
        />
        <Button
          variant="contained"
          sx={{ height: "50px" }}
          onClick={handleSubmit}
          // endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Stack>
    </div>
  );
}

export default App;
