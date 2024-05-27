import { useEffect, useState } from 'react'
import logo from '/images/logo.svg'
import downArrow from '/images/icon-arrow-down.svg'
import moon from '/images/icon-moon.svg'
import newWindow from '/images/icon-new-window.svg'
import play from '/images/icon-play.svg'
import search from '/images/icon-search.svg'
import axios from 'axios'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [data, setData] = useState()
  const [finalInput, setFinalInput] = useState('welcome')

  const handleSubmit = (e) =>{
    e.preventDefault()
    setFinalInput(searchInput)
  }
  useEffect(() =>{
    const getData = async() =>{
      try{
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalInput}`)
        setData(response.data[0])
      }
      catch(error){
        console.error(error);
        console.log('noData :(');
      }
    }
    getData()
  },[finalInput])

  useEffect(()=>{
    console.log(data);
  },[data])

  return (
    <div className='mainApp'>
      <header>
        <img src={logo} alt="" className='headerLeft'/>
        <div className="headerRight">
          <div className="fontSelect">
            <p>Mono</p>
            <img src={downArrow} alt="" />
          </div>
          <div className="darkMode">
            <img src={moon} alt="" />
          </div>
        </div>
      </header>
      <main>
        <form action="" className="searchBar" onSubmit={handleSubmit}>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.currentTarget.value)}/>
          <button type='submit' className='submitBtn'>
          <img src={search} alt=""/>
          </button>
        </form>
        {data ? <article>
          <section className="wordContainer">
            <div className="read">
              <h1 className='word'>{data.word}</h1>
              <h2 className='phonetic'>{data.phonetic}</h2>
            </div>
            
              <img className='playImg' src={play} alt="" />
           
          </section>
          {data.meanings.map((mean) =>(
            <section className='meaning'>
              <h3 className="partOfSpeech">{mean.partOfSpeech}</h3>
              <h4>Meaning</h4>
              <ul className='definitions'>
                {mean.definitions.map((data) =>(
                  <li>{data.definition}</li>
                ))}
              </ul>
              {mean.synonyms.length > 0 && 
                <div className='synonym'>
                <p>Synonyms</p>
                <h2>{mean.synonyms}</h2>
              </div>}
          </section>
          ))}
          
          
        </article> :
        ''}
      </main>
    </div>
  )
}

export default App
