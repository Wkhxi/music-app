import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getRankList } from './store/index';
import {
  List,
  ListItem,
  SongList,
  Container
} from './style';
import Scroll from '../../baseUI/scroll/index';
import Loading from '../../baseUI/loading';
import { EnterLoading } from './style';
import { renderRoutes } from 'react-router-config';


//排行榜编号
export const RankTypes = {
  "0": "云音乐新歌榜",
  "1": "云音乐热歌榜",
  "2": "网易原创歌曲榜",
  "3": "云音乐飙升榜",
  "4": "云音乐国电榜",
  "5": "UK排行榜周榜",
  "6": "美国Billboard周榜",
  "7": "KTV唛榜",
  "8": "iTunes榜",
  "9": "Hit FM Top榜",
  "10": "日本Oricon周榜",
  "11": "韩国Melon排行榜周榜",
  "12": "韩国Mnet排行榜周榜",
  "13": "韩国Melon原声周榜",
  "14": "中国TOP排行榜（港台榜）",
  "15": "中国TOP排行榜（内地榜）",
  "16": "香港电台中文歌曲龙虎榜",
  "17": "华语金曲榜",
  "18": "中国嘻哈榜",
  "19": "法国 NRJ Vos Hits 周榜",
  "20": "台湾Hito排行榜",
  "21": "Beatport全球电子舞曲榜",
  "22": "云音乐ACG音乐榜",
  "23": "江小白YOLO云音乐说唱榜"
};

// 找出第一个 没有歌名的排行榜的索引
const filterIndex = (rankList) => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
}

//  根据name 找 排行榜的编号
// const filterIdx = (name, RankTypes) => {
//   for (var key in RankTypes) {
//     if (RankTypes[key] === name) return key;
//   }
//   return null;
// }


function Rank (props) {

  const { rankList: list, loading } = props;
  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS () : [];

  useEffect(() => {
    getRankListDataDispatch();
    // eslint-disable-next-line
  }, []);

  // 官方榜单数据有 tracks 数组，存放部分歌曲信息
  // 全球榜单没有
  // 根据这个区别将两个榜单数据区分开
  const globalStartIndex = filterIndex(rankList);
  const officialList = rankList.slice(0, globalStartIndex); // 官方榜单
  const globalList = rankList.slice(globalStartIndex); // 全球榜单

  // 点击进入详情
  const enterDetail = (detail) => {
    // const idx = filterIdx(name, RankTypes);
    // if(idx === null) {
    //   alert("暂无相关数据");
    //   return;
    // }
    props.history.push(`/rank/${detail.id}`)
  }

// tracks 列表
  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={ index }>{index+1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  };

  // global 标志 是否为全球榜单
  const renderRankList = (list, global) => {
    return (
      <List globalRank={ global }>
        {
          list.map((item, index) => {
            return (
              <ListItem key={ `${item.coverImgId}${index}` } tracks={ item.tracks } onClick={ () => enterDetail(item) }>
                <div className="img_wrapper">
                  <img src={ item.coverImgUrl } alt=""/>
                  <div className="decorate"></div>
                  <span className="update_frequency">{ item.updateFrequency }</span>
                </div>
                {/* 官方榜单才有tracks */}
                { renderSongList(item.tracks)  }
              </ListItem>
            )
          })
        }
      </List>
    )
  }


  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="official" style={ loading ? {"display":"none"}:  {"display": ""} }> 官方榜 </h1>
            { renderRankList(officialList) }
          <h1 className="global" style={ loading ? {"display":"none"}:  {"display": ""} }> 全球榜 </h1>
            { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
        </div>
      </Scroll>
      { renderRoutes(props.route.routes) }
    </Container>

  )
}



const mapStateToProps = (state) => ({
  rankList: state.rank.getIn(['rankList']),
  loading: state.rank.getIn(['loading'])
});

const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch () {
      dispatch(getRankList());
    }
  }
};

export default connect (mapStateToProps, mapDispatchToProps)(React.memo(Rank));