import React, { useState } from 'react';
import { PrimaryButton } from './../Buttons/Buttons';
import { Input, Select } from '../Inputs/Inputs';
import style from './Dashboard.module.css';
import axios from 'axios';
import { PostStatistics } from '../PostStatistics/PostStatistics';
import { Posts } from '../Posts/Posts';

type TokenData = {
	sl_token: string
	client_id: string
	email: string
}

type Posts = {
	id: string,
	from_name: string,
	from_id: string,
	message: string,
	tpye: string,
	created_time:string
}

type PostsData = {
	page: number,
	posts: []
}
const sortByOptions = [
	{ value: '1', label: 'See all posts' },
	{ value: '2', label: 'The number of posts each person made in total' },
	{ value: '3', label: 'Average number of characters of their posts' },
	{ value: '4', label: 'The number of posts each person made every month' },
	{ value: '5', label: 'Each person’s longest post'}
];

const Dashboard = () => {
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [nameError, setNameError] = useState<boolean>(false);
	const [emailError, setEmailError] = useState<boolean>(false);
	const [clientId] = useState<string>('ju16a6m81mhid5ue1z3v2g0uh');
	const [tokenData, setTokenData] = useState<TokenData>();
	const [posts, setPosts] = useState<Array<PostsData>>();
	const [loading, setLoading] = useState<boolean>(false);
	const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};
	const handleUserEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	const generateToken = async () => {
		const data = new FormData();
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		data.append('client_id', clientId);
		if (!re.test(email)) {
			setEmailError(true)
		}
		if (name === '') {
			setNameError(true)
		}
		if (name !== '') {
			setNameError(false)
		}
		if (re.test(email)) {
			setEmailError(false)
		}
		if (re.test(email) && name !== '') {
			data.append('email', email);
			data.append('name', name);
			const response = await axios.post('https://api.supermetrics.com/assignment/register', data);
			setTokenData(response.data.data);
		}
	};
	const fetchPostsData = async () => {
		let page = 1;
		const responseData:PostsData[] = [];
		setLoading(true);
		if (tokenData && page<11) {
			do {
				const params = '?sl_token='+tokenData.sl_token+'&page='+page.toString();
				const response = await axios.get('https://api.supermetrics.com/assignment/posts'+params, {});
				responseData.push(response.data.data);
				page = page + 1;
			} while (page <= 10);
		}
		if (responseData.length === 10) {
			setPosts(responseData);
			setLoading(false);
		}
	};
	const [options, setOption] = useState<string>(sortByOptions[0].value);
	function handleSortBy(e: React.FormEvent<HTMLSelectElement>) {
		const { selectedIndex } = e.currentTarget;
		setOption(sortByOptions[selectedIndex].value);
	}
	const getContents = (() => {
		if(!loading && posts) {
			switch (options) {
			case '1':
				return <Posts data={posts} />;
			case '2':
				return <PostStatistics data={posts} />;
			default:
				return <PostStatistics data={posts} />;
			}
		}
		return <></>;
	})()
	return (
		<div className={style.dashboard}>
			<div className={tokenData === undefined ? style.fetchToken : style.disable}>
				<h3>Register a short-lived token on the fictional Supermetrics Social Network REST API</h3>
				<Input
					text={'Please enter your name here...'}
					value={clientId}
					disable
					action={handleUserName}
					error={false}
				/>
				<Input
					text={'Please enter your name here...'}
					value={name}
					disable={false}
					action={handleUserName}
					error={nameError}
					errorMessage={'Please enter a name'}
				/>
				<Input
					text={'Please enter your email here...'}
					value={email}
					disable={false}
					action={handleUserEmail}
					error={emailError}
					errorMessage={'Please enter a valid email'}
				/>
				<br />
				<PrimaryButton action={generateToken} text='Register a token' />
				<br />
				<div className={style.lineSeperator} />
			</div>
			
			<div className={tokenData !== undefined ? style.displayData : style.disable}>
				<h3>Registered token details:</h3>
				<strong>Client Id: </strong> {tokenData?.client_id}<br></br>
				<strong>Email: </strong> {tokenData?.email}<br></br>
				<strong>Sl_token: </strong> {tokenData?.sl_token}
				<div className={style.lineSeperator} />
			</div>
			
			<div className={tokenData !== undefined && posts === undefined ? style.fetchTokenData: style.disable}>
				<h3>Fetch the posts of fictional users on a fictional social platform and process their posts.</h3>
				<label htmlFor="sl_token">Sl_token</label>
				<Input
					text={'Please enter your name here...'}
					value={tokenData?.sl_token ? tokenData?.sl_token : ''}
					disable
					action={handleUserName}
					error={false}
				/>
				<PrimaryButton action={fetchPostsData} text={loading ? 'Loading ...' : 'Fecth 1000 posts'} />
			</div>
			<div className={posts !== undefined && posts.length === 10  ? style.posts: style.disable}>
				<h3>Create a dashboard for each user showing some or all of the following:</h3>
				<p>Create a simple modern application in React or VueJS or their derivatives (NextJS for example is fine) which displays the 1000 posts in a paginated format. Please note, we will not be evaluating any design.</p>
				<div className={style.actions}>
					<Select
						options={sortByOptions}
						value={options}
						onChange={handleSortBy}
					/>
				</div>
				{getContents}
			</div>
		</div>
	);
}

export default Dashboard;