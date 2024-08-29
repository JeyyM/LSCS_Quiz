import React from 'react';

// just the menu at the side, no real functions
function SideNav() {
  return (
    <nav className="side-nav">
      <button className='school-button'>
        <img className='school-img' src="/dlsu logo.png" alt="DLSU Logo" />
      </button>              
      <button className='nav-item-2'>
        <img className='profile-img' src="/blank profile.png" alt="Blank Profile"/>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-dashboard">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-book nav" style={{background: "orangered"}}>&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-group">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-calendar">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-inbox">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-clock">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-studio">&nbsp;</div>
      </button>
      <button className='nav-item'>
      <img className='kaltura-img' src="/kaltura.png" alt="Kaltura"/>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-question">&nbsp;</div>
      </button>
      <button className='nav-item'>
        <div className="nav-svg nav-library">&nbsp;</div>
      </button>

      <button className='nav-item' style={{marginTop:"auto", minHeight:"4.5rem"}}>
        <div className="nav-svg nav-back">&nbsp;</div>
      </button>
    </nav>
  );
}

export default SideNav;
