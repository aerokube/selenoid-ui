import styled from 'styled-components/macro'

const borderStatsColor = '#3d444c';
const borderSectionColor = '#353b42';

export const StyledStats = styled.div`
  min-height: 200px;
  width: 100%;
  min-width: 360px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 40px;
  flex-shrink: 0;

  .section-title {
    color: #666;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 5%;
    border-bottom: 1px solid ${borderSectionColor};
    width: 95%;
    letter-spacing: 1px;
    font-size: 10px;
    line-height: 20px;
  }


  .quota {
    border-right: 1px dashed ${borderStatsColor};
    margin-right: 10px;
  }
`;
