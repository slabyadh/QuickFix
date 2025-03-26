//tester firebase creer un document
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'

interface testData {
    id: string
    name: string
}

const TestFirestore = () => {
    const [data, setData] = useState<testData[]>([])
    const [newName, setNewName] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const querySnapshot = await getDocs(collection(db, 'test'))
            setData(querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name } as testData)))
        }
        catch (error) {
            console.error("erreur", error)  
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddData = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim()) return
        
        try {
            // Ajouter un document à la collection 'test'
            await addDoc(collection(db, 'test'), {
                name: newName
            })
            setNewName("")
            // Rafraîchir les données
            fetchData()
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error)
        }
    }

    return (
        <div>
            <h1>Test Firestore</h1>
            
            {/* Formulaire pour ajouter des données */}
            <form onSubmit={handleAddData}>
                <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Entrez un nom" 
                />
                <button type="submit">Ajouter</button>
            </form>
            
            {loading ? (
                <p>Chargement...</p>
            ) : data.length > 0 ? (
                <ul>
                    {data.map(d => <li key={d.id}>{d.name}</li>)}
                </ul>
            ) : (
                <p>Aucune donnée trouvée. Ajoutez-en!</p>
            )}
        </div>
    )
}

export default TestFirestore;