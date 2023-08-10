import React, { useEffect, useState } from 'react'
import Layout from "../components/Layout/Layout"
import Intro from '../components/profile/Intro'
import Education from '../components/profile/Education'
import SkillsList from '../components/profile/SkillsList'
import ProjectList from '../components/profile/ProjectList'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db, storage } from '../config/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import Loading from '../components/Loading'


const Home = () => {
  const id = process.env.REACT_APP_FIREBASE_PROFILE_ID
  const [user, setUser] = useState({});
  const [imageUrl, setImageUrl] = useState("")
  const [frontend, setFrontend] = useState([])
  const [backend, setBackend] = useState([])
  const [tools, setTools] = useState([])
  const [learning, setLearning] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
    
  const getData = async ()=>{
    
    try{
      const response = await getDoc(doc(db, "profile", id))
      setUser(response?.data())

      //profile image
      const image = await getDownloadURL(ref(storage, response?.data()?.image))
      setImageUrl(image)
      // console.log(response?.data()) 
      //given bellow 
      await getSkills(); 
      //given bellow 
      await getProjects();

      setInterval(() => {
        setLoading(false)
      }, 1000);
      
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  const getSkills = async ()=>{
  
    try{
      const id = process.env.REACT_APP_FIREBASE_SKILLS_ID;
      const response = await getDoc(doc(db, "skills", id))
    //   console.log(response.data())
      setFrontend(response?.data()?.frontend)
      setBackend(response?.data()?.backend)
      setTools(response?.data()?.tools)
      setLearning(response?.data()?.learning)
      
    }catch(error){
      console.log(error)
    }
  }

  const getProjects = async ()=>{
    try{
        const response = await getDocs(collection(db, "projects"))
        setProjects(response.docs.map((doc)=>{
            return {...doc.data(), id: doc.id} //object with data and id, because id not provided inside data
        }))
        // console.log(response)
    }catch(error){
        console.log(error)
    }
}



  return (
    <Layout>
      <Intro 
        user={user}
        imageUrl={imageUrl}
      />
      <Education />
      <SkillsList 
        frontend={frontend}
        backend={backend}
        tools={tools}
        learning={learning}
      />
      <ProjectList 
        projects={projects}
      />
    </Layout>
  )
}

export default Home