import '../css/AlgoScreen.css';
import '../css/App.css';
import {
	BsBookHalf,
	BsFileEarmarkCodeFill,
	BsFileEarmarkFill,
	BsFileEarmarkFontFill,
	BsFillSunFill,
	BsMoonFill,
} from 'react-icons/bs';
import AnimationManager from '../anim/AnimationMain';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import ReactGA from 'react-ga4';
import { algoMap } from '../AlgoList';
import modals from '../examples/ExampleModals';

class AlgoScreen extends React.Component {
	constructor(props) {
		super(props);
		const algoName = props.location.pathname.slice(1);
		this.canvasRef = React.createRef();
		this.animBarRef = React.createRef();
		// NEW CHANGES
		const queryParams = new URLSearchParams(props.location.search); // stores parameter values
		if (queryParams.size > 0) {
			const values = queryParams.get('params').split(' '); // splits into array of values
			console.log("vals " + values.at(0));
		}
		this.state = {
			algoName: algoName,
			examplesEnabled: false,
			width: 0,
			theme: 'light',
			pseudocodeType: 'english',
		};
		ReactGA.send({ hitType: 'pageview', page: algoName });
	}

	getState() {
		return this.state;
	}

	componentDidMount() {
		if (algoMap[this.state.algoName]) {
			this.animManag = new AnimationManager(this.canvasRef, this.animBarRef);

			this.currentAlg = new algoMap[this.state.algoName][1](
				this.animManag,
				this.canvasRef.current.width,
				this.canvasRef.current.height,
			);
			window.addEventListener('resize', this.updateDimensions);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.animManag.changeSize(document.body.clientWidth);
	};

	render() {
		const algoName = this.state.algoName;
		const theme = this.props.theme;
		const toggleTheme = this.props.toggleTheme;
		const pseudocode = this.state.pseudocodeType;

		if (!algoMap[algoName]) {
			return (
				<div className="container">
					<Header />
					<div className="content">
						<div className="four-o-four">
							<h1>404!</h1>
							<h3>
								Algorithm not found! Click <Link to="/">here</Link> to return to the
								home screen and choose another algorithm.
							</h3>
						</div>
					</div>
					<Footer />
				</div>
			);
		}

		const isQuickSelect = algoMap[algoName][0] === 'QuickSelect / kᵗʰ Select';

		// check for verbose name in algoMap
		const header = algoMap[algoName][3] ? algoMap[algoName][3] : algoMap[algoName][0];

		return (
			<div className="VisualizationMainPage">
				<div id="container">
					<div id="header">
						<h1>
							<Link to="/">&#x3008;</Link>&nbsp;&nbsp;
							{isQuickSelect ? (
								<>
									QuickSelect / k<sup>th</sup> Select
								</>
							) : (
								<>{header}</>
							)}
							<div id="toggle">
								{theme === 'light' ? (
									<BsFillSunFill
										size={31}
										onClick={toggleTheme}
										color="#f9c333"
										className="rotate-effect"
									/>
								) : (
									<BsMoonFill
										size={29}
										onClick={toggleTheme}
										color="#d4f1f1"
										className="rotate-effect"
									/>
								)}
							</div>
						</h1>
					</div>

					<div id="mainContent">
						<div id="algoControlSection">
							<table id="AlgorithmSpecificControls"></table>
							<div id="toggles">
								{algoMap[algoName][2] && pseudocode === 'none' && (
									<BsFileEarmarkFill
										className="pseudocode-toggle"
										size={32}
										onClick={this.togglePseudocode}
										opacity={'40%'}
										title="Code: Hidden"
									/>
								)}
								{algoMap[algoName][2] && pseudocode === 'english' && (
									<BsFileEarmarkFontFill
										className="pseudocode-toggle"
										size={32}
										onClick={this.togglePseudocode}
										title="Code: English"
									/>
								)}
								{algoMap[algoName][2] && pseudocode === 'code' && (
									<BsFileEarmarkCodeFill
										className="pseudocode-toggle"
										size={32}
										onClick={this.togglePseudocode}
										title="Code: Pseudo"
									/>
								)}
								{modals[algoName] && (
									<BsBookHalf
										className="menu-modal"
										size={30}
										onClick={this.toggleExamples}
										opacity={this.state.examplesEnabled ? '100%' : '40%'}
										title="More Information"
									/>
								)}
							</div>
						</div>

						<div className="viewport">
							<canvas
								id="canvas"
								width={this.state.width}
								height="505"
								ref={this.canvasRef}
							></canvas>
							{this.state.examplesEnabled && (
								<div className="modal">
									<div className="modal-content">{modals[algoName]}</div>
								</div>
							)}
						</div>

						<div id="generalAnimationControlSection">
							<table id="GeneralAnimationControls" ref={this.animBarRef}></table>
						</div>
					</div>

					<div id="footer">
						<p>
							<Link to="/">Return to Home Page</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}

	toggleExamples = () => this.setState(state => ({ examplesEnabled: !state.examplesEnabled }));

	togglePseudocode = () => {
		const pseudocodeMap = { none: 'english', english: 'code', code: 'none' };
		this.animManag.updateLayer(32, this.state.pseudocodeType === 'none');
		this.animManag.updateLayer(33, this.state.pseudocodeType === 'english');
		this.setState(state => ({ pseudocodeType: pseudocodeMap[state.pseudocodeType] }));
	};
}

AlgoScreen.propTypes = {
	location: PropTypes.object,
};

export default AlgoScreen;
