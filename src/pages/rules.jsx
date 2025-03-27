import React from "react";

const Rules = () => {
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const headingStyle = {
    color: "#2c3e50",
    marginBottom: "1rem",
  };

  const subHeadingStyle = {
    color: "#34495e",
    margin: "1rem 0 0.5rem",
  };

  const listStyle = {
    marginLeft: "1.5rem",
    marginBottom: "1rem",
  };

  const linkStyle = {
    color: "#2980b9",
    textDecoration: "underline",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Call of Duty League Competitive Rules</h1>
      <p>
        Welcome to the official rules page for competitive Call of Duty gaming.
        Below are the key rules and guidelines for participating in CDL
        tournaments and matches.
      </p>

      {/** 1. FORMAT / PROCEDURES */}
      <h2 style={subHeadingStyle}>1. Format / Procedures</h2>
      <ol style={listStyle}>
        <li>
          <strong>4v4 Format</strong>: All matches are played with four (4)
          players on each team.
        </li>
        <li>
          <strong>Roster Size</strong>: Each team must have a minimum of four
          (4) players and a maximum of eight (8) players.
        </li>
        <li>
          <strong>Match Format</strong>: Matches are Best-of-Five (Bo5).
        </li>
        <li>
          <strong>Playoffs Championship</strong>: The final playoff match is
          Best-of-Seven (Bo7).
        </li>
      </ol>

      {/** 2. GAME SETTINGS */}
      <h2 style={subHeadingStyle}>2. Game Settings</h2>
      <ol style={listStyle}>
        <li>
          Use the current{" "}
          <a
            href="https://callofdutyleague.com/en-us/competitive-settings"
            style={linkStyle}
            target="_blank"
            rel="noreferrer"
          >
            league player ruleset
          </a>
          .
        </li>
        <li>
          <strong>"GAs" (Gentlemen's Agreements)</strong>
          <ol style={listStyle}>
            <li>
              GAs or Gentlemen's Agreements are not enforced unless both teams
              agree in writing.
            </li>
            <li>
              If GAs are violated, the team reporting must provide proof. The
              violating team forfeits that game in the series.
            </li>
            <li>
              Reference:{" "}
              <a
                href="https://docs.google.com/document/u/0/d/1AGuH5BErDNsNu880S7zqFb1UuEyjj2x2h754B1zRrSU/mobilebasic?pli=1"
                style={linkStyle}
                target="_blank"
                rel="noreferrer"
              >
                Call of Duty: Black Ops 6 Gentlemen's Agreement list
              </a>
            </li>
          </ol>
        </li>
      </ol>

      {/** 3. PROHIBITED ITEMS */}
      <h2 style={subHeadingStyle}>3. Prohibited Items</h2>
      <p style={{ marginLeft: "1.5rem" }}>
        Please use the current League Play restricted items list to determine
        which primaries, secondaries, attachments, tactical/lethal gear, field
        upgrades, perks, wildcards, and scorestreaks are not permitted.
      </p>

      {/** 4. MAP POOLS */}
      <h2 style={subHeadingStyle}>4. Map Pools</h2>
      <p style={{ marginLeft: "1.5rem" }}>
        The following maps are used for CDL Hardpoint, Search &amp; Destroy, and
        Control:
      </p>
      <ol style={listStyle}>
        <li>
          <strong>Hardpoint</strong>
          <ul style={listStyle}>
            <li>Protocol</li>
            <li>Red Card</li>
            <li>Hacienda</li>
            <li>Skyline</li>
            <li>Vault</li>
          </ul>
        </li>
        <li>
          <strong>Search and Destroy</strong>
          <ul style={listStyle}>
            <li>Protocol</li>
            <li>Red Card</li>
            <li>Hacienda</li>
            <li>Skyline</li>
            <li>Vault</li>
          </ul>
        </li>
        <li>
          <strong>Control</strong>
          <ul style={listStyle}>
            <li>Protocol</li>
            <li>Hacienda</li>
            <li>Vault</li>
          </ul>
        </li>
      </ol>

      {/** 5. MAP SELECTIONS / HOST PROCEDURE */}
      <h2 style={subHeadingStyle}>5. Map Selections &amp; Host Procedure</h2>
      <ol style={listStyle}>
        <li>
          <strong>Home Team / Host</strong>: Team on the left side (Team A)
          schedules the match and acts as host. In playoffs, the higher seed
          chooses who is home (Team A) or away (Team B).
        </li>
        <li>
          <strong>Host Assignments</strong>: For a Bo5, Team A hosts maps
          1,3,5; Team B hosts maps 2,4. For a Bo7, Team A hosts maps 1,3,5,7 and
          Team B hosts maps 2,4,6.
        </li>
        <li>
          <strong>Bo5 (Best of Five) Procedure</strong>
          <ol style={listStyle}>
            <li>
              <em>Hardpoint</em>
              <ul style={listStyle}>
                <li>Team A bans one map</li>
                <li>Team B bans one map</li>
                <li>Team A picks Map 1 from remaining maps</li>
                <li>Team B picks Map 4 from remaining maps</li>
                <li>Team A picks side for Map 4</li>
                <li>Team B picks side for Map 1</li>
              </ul>
            </li>
            <li>
              <em>Search &amp; Destroy</em>
              <ul style={listStyle}>
                <li>Team B bans one map</li>
                <li>Team A bans one map</li>
                <li>Team B picks Map 2 from remaining maps</li>
                <li>Team A picks Map 5 from remaining maps</li>
                <li>Team B picks side for Map 5</li>
                <li>Team A picks side for Map 2</li>
              </ul>
            </li>
            <li>
              <em>Control</em>
              <ul style={listStyle}>
                <li>Team A bans one map</li>
                <li>Team B bans one map</li>
                <li>Remaining map is Map 3</li>
                <li>Team B picks side for Map 3</li>
              </ul>
            </li>
          </ol>
        </li>
        <li>
          <strong>Bo7 (Best of Seven) Procedure</strong>
          <ol style={listStyle}>
            <li>
              <em>Hardpoint</em>
              <ul style={listStyle}>
                <li>Team A bans one map</li>
                <li>Team B bans one map</li>
                <li>Team A picks Map 1</li>
                <li>Team B picks Map 4</li>
                <li>Remaining map is Map 7</li>
                <li>Team A picks side for Map 4</li>
                <li>Team B picks side for Map 1</li>
                <li>Team A picks side for Map 7</li>
              </ul>
            </li>
            <li>
              <em>Search &amp; Destroy</em>
              <ul style={listStyle}>
                <li>Team B bans one map</li>
                <li>Team A bans one map</li>
                <li>Team B picks Map 2</li>
                <li>Team A picks Map 5</li>
                <li>Team B picks side for Map 5</li>
                <li>Team A picks side for Map 2</li>
              </ul>
            </li>
            <li>
              <em>Control</em>
              <ul style={listStyle}>
                <li>Team A bans one map</li>
                <li>Team B bans one map</li>
                <li>Remaining map is Map 6</li>
                <li>Team A picks side for Map 3</li>
                <li>Team B picks side for Map 6</li>
              </ul>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  );
};

export default Rules;
