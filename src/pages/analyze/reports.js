import * as React from 'react';
import { connect } from 'react-redux';
import { parse as parseDuration, toSeconds } from 'iso8601-duration';
import { navigate } from 'gatsby';
import Layout from '../../components/layouts/layout';

const AnalyzePage = ({ batchCounter, videos }) => {

  // const [reportType, setReportType] = React.useState("");
  const [rpt3m, setRpt3m] = React.useState([]);
  const [rpt6m, setRpt6m] = React.useState([]);
  const [rpt9m, setRpt9m] = React.useState([]);

  const collectTagsCount = (videos, statisticField) => {
    const tags = {};
    videos.foreach(v => {
      const value = parseInt(v.statistics[statisticField], 10);
      v.snippet.tags.forEach(tag => {
        tags[tag] = value + (tags[tag] || 0);
      });
    });
    return Object.entries(tags).sort((a, b) => a[1] > b[1] ? 1 : -1);
  };

  const getTopVideos = (videos, statisticField) => {
    return [...videos].sort((a, b) => parseInt(a.statistics[statisticField], 10) > parseInt(b.statistics[statisticField], 10) ? 1 : -1);
  };

  React.useEffect(() => {

  }, [rpt3m]);

  React.useEffect(() => {

  }, [rpt6m]);

  React.useEffect(() => {

  }, [rpt9m]);

  React.useEffect(() => {
    if (batchCounter.videos.finished) {
      const allVideos = videos.map(v => {
        v.contentDetails.durationSecs = toSeconds(parseDuration(v.contentDetails.duration));
        v.snippet.publishedYM = v.snippet.publishedAt.split("T")[0].split("-").slice(0, -1).join("-");
        return v;
      }).sort((a, b) => a.snippet.publishedYM > b.snippet.publishedYM ? -1 : 1);
      const allActiveVideos = allVideos.filter((v) => v.status.uploadStatus === 'processed');

      const d = new Date();
      // make d to previous 3 months
      d.setMonth(d.getMonth() - 3);
      const previous3months = d.toISOString().split("T")[0].split("-").slice(0, -1).join("-");
      // make d to previous 6 months
      d.setMonth(d.getMonth() - 3);
      const previous6months = d.toISOString().split("T")[0].split("-").slice(0, -1).join("-");
      // make d to previous 9 months
      d.setMonth(d.getMonth() - 3);
      const previous9months = d.toISOString().split("T")[0].split("-").slice(0, -1).join("-");

      setRpt3m(allVideos.filter(v => v.snippet.publishedYM <= previous3months));
      setRpt6m(allVideos.filter(v => v.snippet.publishedYM <= previous6months));
      setRpt9m(allVideos.filter(v => v.snippet.publishedYM <= previous9months));


      window.allVideos = allActiveVideos;

      // top 30 videos with highest views
      // top 30 videos with highest likes
      // top 30 tags with highest views
      // top 30 tags with highest likes

    }
  }, [batchCounter.videos.finished]);

  React.useEffect(() => {
    if (!batchCounter.videos.finished) {
      navigate('/analyze/youtube');
    }
  }, []);

  return (
    <Layout >
      Report page
    </Layout>
  );
};

const mapStateToProps = state => ({
  batchCounter: state.batchCounter,
  videos: state.youtube.videos,
});

export default connect(mapStateToProps)(AnalyzePage);