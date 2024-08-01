"use client";

import Button from "@/app/_components/Button";
import React, { useState } from "react";

function FormModal({ closeModal }: { closeModal: () => void }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		/* eslint-disable jsx-a11y/label-has-associated-control */
		<div className="modal-content">
			<h2>Form Modal</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name">Name:</label>
					<input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div>
					<label htmlFor="email">Email:</label>
					<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<Button variant="secondary" onClick={closeModal}>
					Submit
				</Button>
			</form>
		</div>
	);
}

export default FormModal;
