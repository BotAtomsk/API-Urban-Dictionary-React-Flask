import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [allTerms, setAllTerms] = useState([]);
	const [searchAdd, setSearchAdd] = useState("")
	const [definition, setDefinition] = useState("")
	//const [singleTerm, setSingleTerm] = useState({})
	const [showClearButton, setShowClearButton] = useState(false)
	const [showModifyButton, setShowModifyButton] = useState(false)
	const [showContainer, setShowContainer] = useState(false)
	const [showIndividualDeleteButton, setShowIndividualDeleteButton] = useState(false)
	const handleGetAll = async () => {
		const resp = await fetch("https://botatomsk-studious-space-giggle-wpwpq7p94j6f675-3001.preview.app.github.dev/api/terms")
		const data = await resp.json()
		setAllTerms(data)
		setShowClearButton(true)
		setShowContainer(true)
	}
	const handleAdd = async (e) => {
		e.preventDefault()
		const opt = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				term: searchAdd,
				definition: definition
			})
		}
		const resp = await fetch("https://botatomsk-studious-space-giggle-wpwpq7p94j6f675-3001.preview.app.github.dev/api/terms", opt)
		const data = await resp.json()
		console.log(data)
		setShowClearButton(false)
		setShowContainer(false)
		setDefinition("")
		setSearchAdd("")
	}
	const handleSearch = async (e) => {
		e.preventDefault()
		try {
			const resp = await fetch("https://botatomsk-studious-space-giggle-wpwpq7p94j6f675-3001.preview.app.github.dev/api/terms/" + searchAdd) //para hacer el GET añadimos la variable searchAdd	
			const data = await resp.json()
			//setSingleTerm(data)
			setDefinition(data.definition)
			setShowIndividualDeleteButton(true)
			setShowModifyButton(true)
		} catch (error) {
			setDefinition("The term you are searching for doesn't exist...")
			setShowIndividualDeleteButton(false)
			setShowModifyButton(false)
		}
		setShowClearButton(true)
	}
	const handleClear = async (e) => {
		e.preventDefault(e)
		setSearchAdd("")
		setDefinition("")
		setShowClearButton(false)
		setShowModifyButton(false)
		setShowIndividualDeleteButton(false)
		setShowContainer(false)
	}
	const handleIndividualDelete = async (e, name) => {
		e.preventDefault(e)
		const opt = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		}
		const resp = await fetch("https://botatomsk-studious-space-giggle-wpwpq7p94j6f675-3001.preview.app.github.dev/api/terms/" + name, opt)
		const data = await resp.json()
		console.log(data)
		console.log(name)
		setSearchAdd("")
		setDefinition("")
		setShowClearButton(false)
		setShowModifyButton(false)
		setShowIndividualDeleteButton(false)
		setShowContainer(false)
	}
	const handleModify = async (e, term) => {
		e.preventDefault()
		const opt = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				term: searchAdd,
				definition: definition
			})
		}
		const resp = await fetch("https://botatomsk-studious-space-giggle-wpwpq7p94j6f675-3001.preview.app.github.dev/api/terms/" + term, opt)
		const data = await resp.json()
		console.log(data)
	}

	return (
		<div className="container w-50 text-center">
			<h1>Urban Dictionary</h1>
			<button className="btn btn-success" onClick={e=>handleGetAll()}>GET ALL THE DEFINITIONS</button>
			<form className="form-control">
				<label htmlFor="term" className="form-text">Term</label>
				<div className="input-group">
					<input className="form-control" type="text" name="term" id="term" placeholder="term-to-search/add" value={searchAdd} onChange={e=>setSearchAdd(e.target.value)}/>
				</div>
				<label htmlFor="definition" className="form-text">Definition</label>
				<textarea id="definition" rows="8" className="form-control" value={definition} name="definition" onChange={e=>setDefinition(e.target.value)}></textarea>
				<div className="d-flex justify-content-between py-3">
					<button className="btn btn-primary" onClick={e=> handleAdd(e)}>Add</button>
					{showClearButton && <button className="btn btn-danger" onClick={e=> handleClear(e)}>Clear</button>}
					{showModifyButton && <button className="btn btn-primary" onClick={e=> handleModify(e, searchAdd)}>Modify</button>}
					{showIndividualDeleteButton && <button className="btn btn-danger" onClick={e=> handleIndividualDelete(e, searchAdd)}>Delete</button>}
					<button className="btn btn-success" onClick={e=>handleSearch(e)}>Search</button>
				</div>
			</form>
			<div id="conjunto" className="container">
				{showContainer && allTerms && allTerms.map(el => <div className="container">
					<button className="btn btn-danger" onClick={e=> handleIndividualDelete(e, el.term)}>X</button>
					<p className="fs-4">{el.term}</p>
					<p>{el.definition}</p>
				</div>)} 
				 { /* singleTerm && (         // no quiero que la definición aparezca debajo de la ventana, sino que la voy a llevar a la textform
					<div className="container">
						<p className="fs-4">{singleTerm.term}</p>
						<p>{singleTerm.definition}</p>
					</div>
				 ) */} 
			</div>
		</div>
	);
};
