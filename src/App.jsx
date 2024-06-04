import { useEffect, useRef, useState } from 'react'
import logo from '/images/logo.svg'
import downArrow from '/images/icon-arrow-down.svg'
import moon from '/images/icon-moon.svg'
import newWindow from '/images/icon-new-window.svg'
import play from '/images/icon-play.svg'
import search from '/images/icon-search.svg'
import axios from 'axios'
import sad from '/images/sad.png'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [data, setData] = useState()
  const [finalInput, setFinalInput] = useState('dictionary')
  const [phonetic, setPhonetic] = useState('')
  const [audio, setAudio] = useState()
  const audioRef = useRef(null)
  const fontList = ['Serif', 'Sans Serif', 'Mono']
  const [changeFont, setChangeFont] = useState(false)
  const [currentFont, setCurrentFont] = useState('Serif')
  const [darkmode, setDarkmode] = useState(false)
  const [fontBorderColor, setFontBorderColor] = useState('#f4f4f4')


  const handleSubmit = (e) =>{
    e.preventDefault()
    if(searchInput){
      setFinalInput(searchInput)
    }
    else{
      setFontBorderColor('#ff5252')
    }
  }

 
  useEffect(() =>{
    const getData = async() =>{
      try{
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalInput}`)
        setData(response.data[0])
        getAudio()
      }
      catch(error){
        setData(null)
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
          setAudio('')
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
  },[audio])

  const changeInput = (newInput) =>{
    setFinalInput(newInput)
    setSearchInput(newInput)
  }

  const fonts = {
    'Serif': 'serif',
    'Sans Serif': 'sans-serif',
    'Mono': 'monospace'
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

  useEffect(() =>{
    if(darkmode){
      document.body.classList.add('dark')
    }
    else{
      document.body.classList.remove('dark')
    }
  },[darkmode])

  return (
    <div className={`mainApp`} style={{fontFamily: fonts[currentFont]}}>
      <header>
        <img src={logo} alt="" className='headerLeft'/>
        <div className="headerRight">
          <div className="fontSelect" ref={fontRef}>
            <div className="currentFont" onClick={() => setChangeFont(prev => !prev)} >
              <p>{currentFont}</p>
              <img src={downArrow} alt="" />
            </div>
            {changeFont &&<ul className={`fonts ${darkmode ? 'darkDropdown' : ''}`} >
              {fontList.map((font) =>(
                <li onClick={() => setCurrentFont(font)} className={currentFont === font ? 'active' : ''}>{font}</li>
              ))}
              </ul>
              }
          </div>
          <div className="line"></div>
          <div className="darkMode">
            <label className="switch" >
              <input type="checkbox" className='checkbox' onChange={() => setDarkmode((prevState) => !prevState)}/>
              <span className='toggle'></span>
              </label>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                <path className={`${darkmode ? 'darkPurple' : ''}`} fill="none" stroke='#838383'stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"/>
                </svg>
          </div>
        </div>
      </header>
      <main>
        <div className="inputForm">
          <form action="" 
          className={`searchBar ${darkmode? 'darkForm' : ''}`} 
          onSubmit={handleSubmit} 
          style={{borderColor: fontBorderColor}}
          onFocus={() => setFontBorderColor('#a445ed')}
          onBlur={() => setFontBorderColor('#f4f4f4')}>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.currentTarget.value)} />
            <button type='submit' className='submitBtn'>
            <img src={search} alt=""/>
            </button>
          </form>
          <p className={fontBorderColor === '#ff5252' ? 'warning' : ''}>Whoops, Can't be empty...</p>
        </div>
        {data ? <article>
          <section className="wordContainer">
            <div className="read">
              <h1 className='word'>{data.word}</h1>
              <h2 onClick={() => audioRef.current.play()} className='phonetic'>{phonetic}</h2>
            </div>
            <div className="audio">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" className='playImg' onClick={() => audioRef.current.play()}>
              <g  fill-rule="evenodd" className='play'>
                <circle cx="37.5" cy="37.5" r="37.5" className='circle'/>
                <path d="M29 27v21l21-10.5z" className='path'/>
              </g>
              </svg>
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
              <a href={url} target='_blank' >
                <h4 className={`originalLink ${darkmode ? 'dark ' : ''}`}>{url}
                  <img src={newWindow} alt=""/>
                </h4>
              </a>
              </div>
            ))}
          </section>
        </article> 
        
        :
        
        <div className='noResult'>
          <img src={sad} alt="Sad icons created by Illosalz - Flaticon" className="emoji" />
          <h4 className="noDef">No Definitions Found</h4>
          <p>Sorry pal, we couldn't find definitions for the word you were looking for. 
            You can try the search again at later time or head to the web instead</p>
        </div>}
      </main>
    </div>
  )
}

export default App
