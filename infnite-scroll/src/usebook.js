import axios from "axios";
import { useState, useEffect } from "react";

export default function useBookSearch(query, pageNumber) {

    const [Loading, isLoading] = useState(true)
    const [error, iserror] = useState(false)
    const [Books, setBooks] = useState([])
    const [hasMore, setHasmore] = useState('')

    useEffect(() => {
        setBooks([])
    },[query])

    
    useEffect(() => {
        let cancel
        isLoading(true)
        iserror(false)
        axios({
            method: 'GET',
            params: { q: query, page: pageNumber },
            url: 'https://openlibrary.org/search.json',
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevbook => {
                return [...new Set([...prevbook, ...res.data.docs.map(b => b.title)])]
            })
            setHasmore(res.data.docs.length > 0)
            isLoading(false)
        }).catch(err => {
            if (axios.isCancel(err)) return;
            iserror(true)
        })

        return () => cancel()
    }, [query, pageNumber])

    return { Loading, error, Books, hasMore }
}
