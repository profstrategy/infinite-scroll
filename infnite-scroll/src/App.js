import useBookSearch from "./usebook";
import { useState, useRef, useCallback } from "react";

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setpageNumber] = useState(1)
 const { Loading, error, Books, hasMore } = useBookSearch(query, pageNumber)

 const observer = useRef()
 const getlastItem = useCallback(node => {
  if(Loading) return
  if(observer.current) observer.current.disconnect()
  observer.current = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) {
      setpageNumber(prevPage => prevPage + 1)
    }
  })

  if(node){
    observer.current.observe(node);
  }
 }, [Loading, hasMore])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setpageNumber(1)
  }

  return (
    <>
      <div>
        <input type="text" value={query} onChange={handleSearch}></input>
        {Books.map((book, index) => {
          if(Books.length === index + 1) {
            return <div key={book} ref={getlastItem}>{book}</div>
          }else {
            return <div key={book}>{book}</div>
          }
           
        })}
        <div>{Loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </div>
    </>
  );
}

export default App;
