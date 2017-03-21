var _ = require('lodash')
var PropTypes = require('react').PropTypes
var React = require('react')
var requireBrowserStyle = require('./env').requireBrowserStyle
var util = require('util')

var ERRORS = require('../ui').errors
var DEFAULT_ERROR_MESSAGE = 'There was an error with your transaction. Reload the page and try again.'
var ERROR_MESSAGE_MAP = _.object([
    [ERRORS.invalidSchema.id, 'The page was unable to load because the schema is invalid.'],
])

requireBrowserStyle()

module.exports = React.createClass({
    displayName: 'StineGillWeddingHoneyfund',
    propTypes: {
        charge: PropTypes.object,
        checkout: PropTypes.func.isRequired,
        addToBasket: PropTypes.func.isRequired,
        removeFromBasket: PropTypes.func.isRequired,
        error: PropTypes.string,
        products: PropTypes.object,
        basket: PropTypes.object
    },

    // TODO: Error Handling
    componentWillReceiveProps: function (next) {
        if (next.error && this.props.charge) this.setState({ })
    },

    handlePayClick: function (e) {
        e.preventDefault()
        this.props.checkout()
    },

    handleBasket: function(id, e) {
        e.preventDefault()
        var ele = document.getElementById("q"+id)
        var q = ele.options[ele.selectedIndex].value
        if(q > 0) {
            this.props.addToBasket(id, q)
        } else {
            this.props.removeFromBasket(id)
        }
    },

    render: function () {
        return (
            <div>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {(function () {
                    if (!this.props.products) return (<div/>)
                    var calcSum = _.bind(function (total, value, key) {
                        return total + (value * this.props.products.getIn([key, 'price']))
                    }, this)
                    return (
                        <table id="store">
                            <thead>
                            </thead>
                            <tbody>
                                {this.props.products.map(function (product, id) {
                                    var image = (product.has('images'))
                                        ? product.get('images').first()
                                        : undefined
                                    var rows = []
                                    rows.push(
                                        <tr key={"r1"+id}>
                                            <td rowSpan="2">
                                                { !_.isEmpty(image) && <img src={image} /> }
                                            </td>
                                            <td className="itemName">{product.get('name')}</td>
                                            <td rowSpan="2">${product.get('price') / 100}</td>
                                            <td rowSpan="2">
                                                <select id={"q"+id} onChange={_.bind(this.handleBasket, this, id)} >
                                                    {_.times(Math.min(product.get('quantity'), 10)+1, function(i) {
                                                        if((!this.props.basket.has(id) && i === 0) ||
                                                           (this.props.basket.get(id) === i)) {
                                                            return ( <option value={i} selected>{i}</option> )
                                                        } else {
                                                            return ( <option value={i}>{i}</option> )
                                                        }
                                                    }, this)}
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                    rows.push(
                                        <tr key={"r2"+id}>
                                            <td className="itemDesc">{product.get('description')}</td>
                                        </tr>
                                    )
                                    return rows
                                }, this)}
                            </tbody>
                            <tfoot>
                                {(!this.props.basket.isEmpty()) && (
                                    <tr>
                                        <td className="total" colSpan="4">
                                            <span>Total = ${this.props.basket.reduce(calcSum, 0) / 100} </span>
                                            <button type="button" onClick={_.bind(this.handlePayClick, this)}>Pay</button>
                                        </td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    )
                }.bind(this))()}
                {(!_.isEmpty(this.props.error) && !document.body.setAttribute('style', 'overflow:hidden;')) && (
                    <aside>
                        <div className="container">
                            <i className="material-icons icon-48">error</i>
                            <p>{ERROR_MESSAGE_MAP[this.props.error] || DEFAULT_ERROR_MESSAGE}</p>
                        </div>
                    </aside>
                )}
            </div>
        )
    },
})
