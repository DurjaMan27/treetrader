import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import UserContext from '../../components/context/UserContext';
import PortfolioForm from '../../components/PortfolioForm';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import './showstock.css';

const ShowStock: React.FC = () => {

  type StringArray = string[];
  interface StockDataStructure {
    name: string,
    ticker: string,
    currPrice: number,
    lastPrice: number,

    industry: string,
    createdAt: Date,
    updatedAt: Date,
  }

  interface ChartDataPoint {
    x: Date,
    y: [
      number, number, number, number
    ]
  }

  const [stock, setStock] = useState<StockDataStructure>({name:'', ticker:'', currPrice:-1, lastPrice:-1, industry:'', createdAt:new Date(), updatedAt:new Date()});
  const [priceDiff, setPriceDiff] = useState('');
  const [generatedSuggestion, setGeneratedSuggestion] = useState(false);
  const [geminiSuggestion, setGeminiSuggestion] = useState<StringArray>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [portfolioForm, setPortfolioForm] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([{x: new Date(), y: [0, 1, 0, 1]}])
  const { ticker } = useParams();

  const context = useContext(UserContext)
  if (! context) {
    throw new Error('UserContext must be used within a User context provider')
  }
  const { signedIn } = context

  const optionsConstant: ApexOptions = {
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
    const response = await axios.get(`https://treetrader-backend.vercel.app/stocks/ticker/${ticker}`, {withCredentials: true});
    if (response && response.data) {
      const { data } = response;
      if (data.stock.name === 'error') {
        setErrorMessage('Sorry, the ticker you are looking for does not exist. Please refine your search criteria.');
      } else {
        setStock(data.stock)
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    setGeneratedSuggestion(false);
    setErrorMessage('');
    findStock();
    getGraphData();
    setLoading(false);
  }, [])

  useEffect(() => {
    if (stock !==  null) {
      findDifference();
      if (!generatedSuggestion) {
        console.log('trying to find generated suggestion')
        callGemini();
        setGeneratedSuggestion(true);
      }
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
    const response = await axios.get(`https://treetrader-backend.vercel.app/stocks/tickerrec/${ticker}`, {withCredentials: true});
    if (response && response.data) {
      const { data } = response;

      console.log('data')
      console.log(data);

      const lines = data.recommendation.split('\n')
      console.log('lines')
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
    const result = await axios.get(`https://treetrader-backend.vercel.app/stocks/tickerdata/${ticker}`, {withCredentials: true});

    if(result && result.data) {
      const data = result.data;
      console.log(data)
      setChartData(data.data)
    }
  }

  const getColor = () => {
    if(geminiSuggestion[1] === '') {
      return 'black';
    } else if(geminiSuggestion[1].toUpperCase() === 'BUY') {
      return 'green';
    } else if(geminiSuggestion[1].toUpperCase() === 'SELL') {
      return 'red';
    }
  }


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
                  <h1 style={{color:  getColor()}}>{ geminiSuggestion[1].toUpperCase() }</h1>
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