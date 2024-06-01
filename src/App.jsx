import { useEffect, useRef, useState } from 'react'
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
  const [phonetic, setPhonetic] = useState('')
  const [audio, setAudio] = useState()
  const audioRef = useRef(null)
  const fontList = ['Serif', 'Sans Serif', 'Mono']
  const [changeFont, setChangeFont] = useState(false)
  const [currentFont, setCurrentFont] = useState('Serif')


  const handleSubmit = (e) =>{
    e.preventDefault()
    setFinalInput(searchInput)
  }

 
  useEffect(() =>{
    const getData = async() =>{
      try{
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalInput}`)
        setData(response.data[0])
        getAudio()
      }
      catch(error){
        console.error(error);
        console.log('noData :(');
      }
    }
    getData()
  },[finalInput])

  const getAudio = () =>{
    if(data){
      for(let i = 0;i < data.phonetics.length;i++){
        if(data.phonetics[i].text && data.phonetics[i].audio){
          setAudio(data.phonetics[i].audio)
          setPhonetic(data.phonetics[i].text)
          break
        }
        else{
          setPhonetic(data.phonetic)
        }
      }
    }
  }

  useEffect(()=>{
    getAudio();
  },[data])

  useEffect(() =>{
    if(audioRef.current){
      audioRef.current.load()
    }
  },[audio, phonetic])

  const changeInput = (newInput) =>{
    console.log(newInput);
    setFinalInput(newInput)
    setSearchInput(newInput)
  }

  const fonts = {
    'Serif': 'serif',
    'Sans Serif': 'sans-serif',
    'Mono': 'monospace'
  }
  const fontActive = (font) =>{
    setCurrentFont(font)
  }

  const fontRef = useRef(null)

  useEffect(() =>{
    const closeDropdown= (event) =>{
      if(fontRef.current && !fontRef.current.contains(event.target)){
        setChangeFont(false)
      }
    }
    window.addEventListener('click', closeDropdown)
    return()=>{
      window.removeEventListener('click', closeDropdown)
    }
  },[])

  return (
    <div className='mainApp' style={{fontFamily: fonts[currentFont]}}>
      <header>
        <img src={logo} alt="" className='headerLeft'/>
        <div className="headerRight">
          <div className="fontSelect" ref={fontRef}>
            <div className="currentFont" onClick={() => setChangeFont(prev => !prev)} >
              <p>{currentFont}</p>
              <img src={downArrow} alt="" />
            </div>
            {changeFont &&<ul className="fonts" >
              {fontList.map((font) =>(
                <li onClick={() => fontActive(font)} className={currentFont === font ? 'active' : ''}>{font}</li>
              ))}
              </ul>
              }
            
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
              <h2 onClick={() => audioRef.current.play()} className='phonetic'>{phonetic}</h2>
            </div>
            <div className="audio">
              <img className='playImg' src={play} alt="" onClick={() => audioRef.current.play()} />
              <audio ref={audioRef} controls>
                <source src={audio} type='audio/mpeg'/>
              </audio>
            </div>
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
                {mean.synonyms.map((synonym) =>(
                <h2 onClick={() => changeInput(synonym)} key={synonym}>{synonym}</h2>
                ))}
              </div>}
              {mean.antonyms.length > 0 &&
                <div className="antonym">
                  <p>Antonyms</p>
                  {mean.antonyms.map((antonym) =>(
                  <h2 onClick={() => changeInput(antonym)} key={antonym}>{antonym}</h2>))}
                </div>
              }
          </section>
          ))}
          <section className="source">
            <p>Source</p>
            {data.sourceUrls.map((url) =>(
              <div key={url}>
              <a href={url} target='_blank'>
                <h4>{url}
                  <img src={newWindow} alt=""/>
                </h4>
              </a>
              </div>
            ))}
          </section>
        </article> :
        ''}
      </main>
    </div>
  )
}

export default App
