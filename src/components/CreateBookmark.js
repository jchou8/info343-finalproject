import React, { Component } from 'react';
import { Button, Collapse, Form, FormGroup, InputGroup, InputGroupAddon, Label, Input } from 'reactstrap';
import Time from 'react-time';

export default class Bookmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarkName: '',
            bookmarkURL: '',
        };
    }

    handleChange(event) {
        let newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    createNewBookmark(event) {
        event.preventDefault();
        this.setState({ bookmarkName: '', bookmarkURL: '' });
        this.props.createBookmarkCallback(this.state.bookmarkName, this.state.bookmarkURL)
    }

    render() {
        return (
            <div className="col-xs-12 col-sm-6">
                <Button color='success' onClick={this.props.toggleCreateBookmark}>
                    <i className={'fa fa-' + (this.props.open ? 'minus' : 'plus')} aria-hidden='true'></i>
                    {this.props.open ? ' Cancel' : ' Add Link'}
                </Button>
                <Collapse isOpen={this.props.open} className='mt-2'>
                    <Form>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon>Name</InputGroupAddon>
                                <Input
                                    type='text'
                                    name="bookmarkName"
                                    id='bookmarkName'
                                    onChange={(e) => this.handleChange(e)}
                                    placeholder='Enter custom name...'
                                    value={this.state.bookmarkName}
                                />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon>URL</InputGroupAddon>
                                <Input
                                    type='text'
                                    name="bookmarkURL"
                                    id='bookmarkURL'
                                    onChange={(e) => this.handleChange(e)}
                                    placeholder='Enter URL...'
                                    value={this.state.bookmarkURL}
                                />
                            </InputGroup>
                        </FormGroup>
                        <Button onClick={(e) => this.createNewBookmark(e)}
                            disabled={(this.state.bookmarkName.length === 0) && (this.state.bookmarkURL.length === 0)} color="primary">
                            <i className='fa fa-plus' aria-hidden='true'></i> Add Bookmark
                    </Button>
                    </Form>
                </Collapse>
            </div>
        );
    }
}
