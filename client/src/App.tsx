import { useState, useEffect } from 'react';
import './App.css';

interface SingleJoke {
  id: number;
  category: string;
  type: string;
  joke: string;
  flags: string;
  safe: boolean;
  lang: string;
}

interface TwopartJoke {
  id: number;
  category: string;
  type: string;
  setup: string;
  delivery: string;
  flags: string;
  safe: boolean;
  lang: string;
}

function App() {
  const baseApiUrl = process.env.REACT_APP_JOKE_SERVER_URL;
  console.log('baseApiUrl', baseApiUrl)
  const [jokes, setJokes] = useState([]);
  const [type, setType] = useState('single');
  const [amount, setAmount] = useState('10');

  const [uppercase, setUppercase] = useState(0);
  const [lowercase, setLowercase] = useState(0);
  const [total, setTotal] = useState(0);
  const [pgCat, setPgCat] = useState(0);
  const [punCat, setPunCat] = useState(0);

  const [lastThirdLetter, setLastThirdLetter] = useState('');
  const [lastThirdLetterFreq, setLastThirdLetterFreq] = useState('');
  const [commonLetter, setCommonLetter] = useState('');
  const [commonLetterFreq, setCommonLetterFreq] = useState('');

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text?.split(new RegExp(/(\s+)/));

    return <span> {parts?.map((part, i) =>
      <span key={i} className={part.toLowerCase().indexOf(highlight.toLowerCase()) !== -1 ? 'highlight' : ''}>
        {part}
      </span>)
    } </span>;
  }

  const getDominant = (pgCat: number, punCat: number) => {
    if (pgCat > punCat) {
      return {
        category: 'Programming',
        percentage: (pgCat * 100 / (pgCat + punCat)).toFixed(1)
      }
    } else if (pgCat < punCat) {
      return {
        category: 'Pun',
        percentage: (punCat * 100 / (pgCat + punCat)).toFixed(1)
      }
    } else {
      return {
        category: 'No dominant',
        percentage: 50
      }
    }
  }

  const changeAmount = (amount: string) => {
    Number(amount) > 10  ? setAmount("10") : Number(amount) < 5 ? setAmount("5") : setAmount(amount)
  }

  useEffect(() => {
    setJokes([]);
    const apiUrl = `${baseApiUrl}?type=${type}&amount=${amount}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(response => {
        // countULcases(response.jokes);
        setJokes(response.jokes);
        let fullStrOrign = '';
        let uppercase = 0;
        let lowercase = 0;
        let total = 0;
        let pgCat = 0;
        let punCat = 0;
        if (type === 'single') {
          response.jokes.map((joke: SingleJoke) => {
            if (joke?.category === 'Programming') pgCat++;
            if (joke?.category === 'Pun') punCat++;
            const jokeStr = joke.joke;
            fullStrOrign += jokeStr
            for (let i = 0; i < jokeStr.length; i++) {
              if (jokeStr[i] !== ' ') total++;
              if (jokeStr[i] >= 'A' && jokeStr[i] <= 'Z') {
                uppercase++;
              }
              else if (jokeStr[i] >= 'a' && jokeStr[i] <= 'z') {
                lowercase++;
              }
            }
            setUppercase(uppercase);
            setLowercase(lowercase);
            setTotal(total);
            setPgCat(pgCat);
            setPunCat(punCat);
          })

          const str = fullStrOrign?.replace(/^[^\w]+|[^\w]+$/g, '').replace(/[^\w]+/g, '').toLowerCase(); // remove all special characters
          const ltl = str.substring(str.length - 3, str.length - 2);
          setLastThirdLetter(ltl);

          const { max, letter, ...counts } = (str || "").split("").reduce(
            (a: any, c: any) => {
              a[c] = a[c] ? a[c] + 1 : 1;
              if (a.max < a[c]) {
                a.max = a[c];
                a.letter = c;
              } else {
                a.max = a.max;
                a.letter = a.letter;
              }
              return a;
            },
            { max: 0, letter: '' }
          );
          setCommonLetter(letter);
          setCommonLetterFreq((max * 100 / str.length).toFixed(1));
          const ltlf = (counts[ltl] * 100 / str.length).toFixed(1);
          setLastThirdLetterFreq(ltlf)
        } else {
          response.jokes.map((joke: TwopartJoke) => {
            if (joke?.category === 'Programming') pgCat++;
            if (joke?.category === 'Pun') punCat++;
            const jokeStr = joke.setup + joke.delivery;
            fullStrOrign += jokeStr
            for (let i = 0; i < jokeStr.length; i++) {
              if (jokeStr[i] !== ' ') total++;
              if (jokeStr[i] >= 'A' && jokeStr[i] <= 'Z') {
                uppercase++;
              }
              else if (jokeStr[i] >= 'a' && jokeStr[i] <= 'z') {
                lowercase++;
              }
            }
            setUppercase(uppercase);
            setLowercase(lowercase);
            setTotal(total);
            setPgCat(pgCat);
            setPunCat(punCat);
          })
          const str = fullStrOrign?.replace(/^[^\w]+|[^\w]+$/g, '').replace(/[^\w]+/g, '').toLowerCase(); // remove all special characters
          const ltl = str.substring(str.length - 3, str.length - 2);
          setLastThirdLetter(ltl);
          const { max, letter, ...counts } = (str || "").split("").reduce(
            (a: any, c: any) => {
              a[c] = a[c] ? a[c] + 1 : 1;
              if (a.max < a[c]) {
                a.max = a[c];
                a.letter = c;
              } else {
                a.max = a.max;
                a.letter = a.letter;
              }
              return a;
            },
            { max: 0, letter: '' }
          );
          setCommonLetter(letter);
          setCommonLetterFreq((max * 100 / str.length).toFixed(1));
          const ltlf = (counts[ltl] * 100 / str.length).toFixed(1);
          setLastThirdLetterFreq(ltlf)
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, [type, amount])

  return (
    <div className="App">
      <header className="App-header">Joke App</header>
      <div className="header-section">
        <div className="option-wrapper">
          <div className="type-option">
            <span className='bold'>Type:</span>
            <select name="type" onChange={(e) => setType(e.target.value)}>
              <option value="single">Single</option>
              <option value="twopart">Two part</option>
            </select>
          </div>
          <div className="amount-option">
            <span className='bold'>Amount:</span>
            <input type="number" min={5} max={10} name="amount" value={amount} onChange={(e) => changeAmount(e.target.value)} />
          </div>
        </div>
        <div className="analytics-section">
          <span className='bold'>Total Characters:</span> {total} <br />
          <span className='bold'>Uppercases Characters:</span> {uppercase} <br />
          <span className='bold'>Lowercases Characters:</span> {lowercase} <br />
          <span className='bold'>Last Third Letter Frequency:</span> "{lastThirdLetter}", {lastThirdLetterFreq}% <br />
          <span className='bold'>Most Common Letter:</span> "{commonLetter}", {commonLetterFreq}% <br />
          <span className='bold'>Dominant category:</span> {getDominant(pgCat, punCat).category}, {getDominant(pgCat, punCat).percentage}%<br />
        </div>
      </div>
      <div className="jokes">
        <div className="joke-item">
          <div className="category-header">Category</div>
          <div className="content-header">Content</div>
        </div>
        {type === 'single' && jokes?.map((joke: any) =>
        (<div className="joke-item">
          <div className="category">{joke.category}</div>
          <div className="content">{getHighlightedText(joke.joke, 'a')}</div>
        </div>
        )
        )}
        {type === 'twopart' && jokes?.map((joke: any) =>
        (<div className="joke-item">
          <div className="category">{joke.category}</div>
          <div className="content">{joke.setup}</div>
          <div className="content">{joke.delivery}</div>
        </div>
        )
        )}
      </div>
    </div>
  );
}

export default App;

