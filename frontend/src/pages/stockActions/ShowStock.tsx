import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import UserContext from '../../components/context/UserContext';
import PortfolioForm from '../../components/PortfolioForm';
import ReactApexChart from 'react-apexcharts';
import './showstock.css';

const ShowStock = () => {

  const optionsConstant = {
    chart: {
      animations: {
        enabled: false,
      },
      type: "candlestick",
    },
    title: {
        text: "CandleStick Chart",
        align: "left",
    },
    xaxis: {
        type: "datetime",
    },
    yaxis: {
        tooltip: {
            enabled: true,
        },
    },
};

  const [stock, setStock] = useState({})
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [portfolioForm, setPortfolioForm] = useState(false);
  const [chartData, setChartData] = useState({})
  const { ticker } = useParams();

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const findStock = async () => {
    const response = await axios.get(`http://localhost:5555/stocks/ticker/${ticker}`);
    if (response && response.data) {
      const { data } = response;
      console.log("here is the data")
      console.log(data);
      if (data.stock.name === 'error') {
        setErrorMessage('Sorry, the ticker you are looking for does not exist. Please refine your search criteria.');
      } else {
        setStock(data.stock)
      }
    }
  }

  const togglePortfolioForm = () => {
    if (portfolioForm) {
      setPortfolioForm(false);
    } else {
      setPortfolioForm(true);
    }
  }

  const getGraphData = async () => {
    const result = await axios.get(`http://localhost:5555/stocks/tickerdata/${ticker}`);

    if(result && result.data) {
      const data = result.data;
      setChartData(data.data)
    }
  }

  useEffect(() => {
    setErrorMessage('');
    findStock();
    getGraphData();
  }, [])


  return (
      <div>
        <BackButton />
        <h1 className='text-3xl my-4'>Show Stock</h1>
        { loading ? (
          <Spinner />
        ) : (
          errorMessage !== '' ? (
            <div>
              <h1>{ errorMessage }</h1>
              <Link to="/">Return to Home Page</Link>
            </div>
          ) : (
            <div>
              <div className='all-show-stock-content'>
                <div className='stock-information'>
                  <div className='stock-id'>
                    <span>Id</span>
                    <span>{ stock._id }</span>
                  </div>
                  <div className='stock-company'>
                    <span>Company</span>
                    <span>{ stock.name }</span>
                  </div>
                  <div className='stock-ticker'>
                    <span>Ticker Symbol</span>
                    <span>{ stock.ticker }</span>
                  </div>
                  <div className='stock-price'>
                    <span>Price</span>
                    <span>{ stock.currPrice }</span>
                  </div>
                </div>
                { signedIn.signedIn ? (
                  <div className='portfolio-options-wrapper'>
                    { portfolioForm ? (
                      <div className='portfolio-form-wrapper'>
                        <PortfolioForm ticker={stock} />
                        <button onClick={togglePortfolioForm}>Close Form</button>
                      </div>
                    ) : (
                      <button onClick={togglePortfolioForm}>Add to Portfolio</button>
                    )}
                  </div>
                ) : (
                  <div className='sign-in-to-view'>
                    <h1>Sign-in to add {stock.ticker} to your portfolio.</h1>
                  </div>
                )}
              </div>

              <div className="graph">
                <ReactApexChart
                  options={optionsConstant}
                  series={
                    [
                      {
                        data: chartData
                      }
                    ]
                  }
                  type="candlestick"
                  height="400"
                  width="600"
                />
              </div>
            </div>
          )
        )}
      </div>
  )
}

export default ShowStock;