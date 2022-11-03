import styled from 'styled-components';
import style from '../../assets/global-style';


export const Container = styled.div`
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100%;
  .official,.global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
`;

export const List = styled.ul`
  margin-top: 10px;
  padding: 0 5px;
  display: ${props => props.globalRank ? "flex": "" }; // 是否为全球榜
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${style["background-color"]};
  /* 因为设置了 space-between， 最后一行如果只有两个，效果是一左一右两个 中间空白 */
  /* 所以，当最后一行的个数 不够填满一行时，伪元素 填补空白 */
  &::after{
    content: '';
    display:block;
    width: 32vw;
  }
`;

export const ListItem = styled.li`
  display: ${props => props.tracks.length ? "flex": ""}; // 是否为全球榜
  padding: 3px 0;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper{
    width:  ${props => props.tracks.length ? "27vw": "32vw"};
    height: ${props => props.tracks.length ? "27vw": "32vw"};
    border-radius: 3px;
    position: relative;
    /* 遮罩层 衬托文字 */
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,100%,0), hsla(0,0%,43%,.4));
    }
    img{
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequency{
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`;

export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 10px;
  >li{
    font-size: ${style["font-size-s"]};
    color: grey;
  }
`;

export const EnterLoading = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
`