import React from 'react';

import Typography from '@material-ui/core/Typography';


/**
 * 404ページ
 */
const NotFound = () => (
  <div>
    <Typography variant="display2" gutterBottom>
      404 Not Found
    </Typography>
    <Typography variant="display1" gutterBottom>
      お探しのページは見つかりませんでした。
    </Typography>
  </div>
);

export default NotFound;
