import React from 'react';
import { Link } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Hidden } from '@material-ui/core';

export default function PrimarySearchAppBar(text) {
  const titleHeight = '45px';

  const infostyle = { position: 'fixed', right: '10px', lineHeight: titleHeight, height: titleHeight, color: '#fff' };
  let info = (
    <span
      // @ts-ignore
      style={infostyle}
    />
  );
  if (text.infoname) {
    info = text.infoname;
    if (text.infoto) {
      info = (
        <Link style={{ height: titleHeight, lineHeight: titleHeight, color: '#fff', fontSize: '0.9rem' }} to={text.infoto}>
          {info}
        </Link>
      );
    }
    info = (
      <span
        // @ts-ignore
        style={infostyle}
      >
        {info}
      </span>
    );
  }
  return (
    <div ws-container-id="title">
      <div
        style={{
          height: titleHeight,
          lineHeight: titleHeight,
          width: '100vw',
          color: '#fffde5',
          backgroundColor: '#fe4365',
          padding: '0px 10px',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          textAlign: 'center'
        }}
      >
        <Link to={text.back}>
          <ArrowBackIos
            style={{
              float: 'left',
              fill: '#fffde5',
              height: titleHeight,
              lineHeight: titleHeight
            }}
          />
        </Link>
        <span style={{ fontSize: '1rem', marginTop: '3px', marginLeft: '2px' }}>{text.name}</span>
        {info}
      </div>
      <div
        style={{
          height: titleHeight,
          width: '100vw',
          margin: 0,
          padding: 0,
          border: 'none'
        }}
      />
    </div>
  );
}
