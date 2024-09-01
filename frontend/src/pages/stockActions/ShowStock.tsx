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

  type StringArray = string[];

  const [stock, setStock] = useState({});
  const [priceDiff, setPriceDiff] = useState('');
  const [geminiSuggestion, setGeminiSuggestion] = useState<StringArray>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [portfolioForm, setPortfolioForm] = useState(false);
  const [chartData, setChartData] = useState({})
  const { ticker } = useParams();

  const context = useContext(UserContext)
  const { signedIn, setSignedIn } = context

  const optionsConstant = {
    chart: {
      animations: {
        enabled: false,
      },
      type: "candlestick",
    },
    title: {
      text: `${ stock.ticker } Historical Price`,
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

  useEffect(() => {
    if (stock !==  null) {
      console.log('here is the stock');
      console.log(stock);
      findDifference();
      callGemini();
    }
  }, [stock])

  const findDifference = async () => {
    const difference = stock.currPrice - stock.lastPrice;
    if (difference < 0) {
      setPriceDiff(`(-$${Math.abs(difference).toFixed(2)})`)
    } else {
      setPriceDiff(`(+$${Math.abs(difference).toFixed(2)})`)
    }
  }

  const callGemini = async () => {
    console.log("calling gemini now")
    const response = await axios.get(`http://localhost:5555/stocks/tickerrec/${ticker}`);
    if (response && response.data) {
      const { data } = response;
      console.log(data.recommendation);
      const lines = data.recommendation.split('\n')
      console.log(lines)
      let temp = ['', '', ''];
      for(let i = 0; i < lines.length; i++) {
        if(lines[i].toLowerCase().startsWith('ticker:')) {
          temp[0] = lines[i].slice(lines[i].toLowerCase().indexOf('ticker:') + 'ticker: '.length + 1).trim();
        } else if(lines[i].toLowerCase().startsWith('recommendation:')) {
          temp[1] = lines[i].slice(lines[i].toLowerCase().indexOf('ticker:') + 'recommendation: '.length + 1).trim();
        } else if(lines[i].toLowerCase().startsWith('explanation:')) {
          temp[2] = lines[i].slice(lines[i].toLowerCase().indexOf('ticker:') + 'explanation: '.length + 1).trim();
        }
      }
      console.log(temp);
      setGeminiSuggestion(temp);
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
      <div className='page-display'>
        { loading ? (
          <Spinner />
        ) : (
          errorMessage !== '' ? (
            <div>
              <h1>{ errorMessage }</h1>
              <Link to="/">Return to Home Page</Link>
            </div>
          ) : (
            <div className='show-stock'>

              <div className='gemini-suggestion-container'>
                <div className='gemini-label'>
                  <h1>Gemini's Suggestion</h1>
                </div>
                <div className='gemini-recommendation'>
                  <h1>{ geminiSuggestion[1].toUpperCase() }</h1>
                </div>
                <div className='gemini-explanation'>
                  <h1>{ geminiSuggestion[2] }</h1>
                </div>
              </div>

              <div className='stock-and-graph'>
                <div className='all-show-stock-content'>
                  <div className='left-side-stock-info'>

                    <div className='stock-information-points'>
                      <div className='stock-ticker'>
                        <span> { stock.ticker }</span>
                      </div>
                      <div className='stock-company'>
                        <span>({ stock.name })</span>
                      </div>
                      <div className='stock-price-and-difference'>
                        <span>${ stock.currPrice } </span>
                        <span className={ stock.currPrice < stock.lastPrice ? 'daily-change-negative' : 'daily-change-positive'}>{ priceDiff }</span>
                      </div>
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

                <div className="graph-container">
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
                    width="800"
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
  )
}

export default ShowStock;