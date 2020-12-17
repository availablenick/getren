import React from 'react';
import { Pagination as BSPagination} from 'react-bootstrap';


class Pagination extends React.Component {
  render() {
    let pageAmount = this.props.info.pageAmount;
    let currentPage = this.props.info.currentPage;

    let paginationItems = [];
    if (pageAmount > 1) {
      if (currentPage <= 3) {
        let maxFirstPageNumber = pageAmount > 5 ? 3 : Math.min(pageAmount, 5);
        for (let i = 1; i <= maxFirstPageNumber; i++) {
          paginationItems.push(
            <BSPagination.Item key={ i }
              active={ currentPage === i }
              onClick={() => { this.props.onClick(i) }}
            >
              { i }
            </BSPagination.Item>
          );
        }

        if (pageAmount > 5) {
          paginationItems.push(<BSPagination.Ellipsis key={ 'e1' }/>);
          paginationItems.push(
            <BSPagination.Item key={ pageAmount }
              onClick={ () => { this.props.onClick(pageAmount) }}
            >
              { pageAmount }
            </BSPagination.Item>
          );
        }

      } else if (currentPage > 3 && currentPage <= pageAmount - 3) {
        paginationItems.push(
          <BSPagination.Item key={ 1 }
            onClick={ () => { this.props.onClick(1) }}
          >
            1
          </BSPagination.Item>
        );
        paginationItems.push(<BSPagination.Ellipsis key={ 'e1' } />);
        paginationItems.push(
          <BSPagination.Item key={ currentPage } active>
            { currentPage }
          </BSPagination.Item>
        );
        paginationItems.push(<BSPagination.Ellipsis key={ 'e2' } />);
        paginationItems.push(
          <BSPagination.Item key={ pageAmount }
            onClick={ () => { this.props.onClick(pageAmount) }}
          >
            { pageAmount }
          </BSPagination.Item>
        );
      } else {
        paginationItems.push(
          <BSPagination.Item key={ 1 }
            onClick={ () => { this.props.onClick(1) }}
          >
            1
          </BSPagination.Item>
        );
        if (pageAmount > 5) {
          paginationItems.push(<BSPagination.Ellipsis key={ 'e1' } />);
        }
        let minLastPageNumber = pageAmount > 5 ? pageAmount - 2 : 2; 
        for (let i = minLastPageNumber; i <= pageAmount; i++) {
          paginationItems.push(
            <BSPagination.Item key={ i }
              active={ currentPage === i }
              onClick={ () => { this.props.onClick(i) }}
            >
              { i }
            </BSPagination.Item>
          );
        }
      }
    }

    return (
      <>
      { pageAmount > 1 &&
        <BSPagination className='children-no-border'>
        <BSPagination.First disabled={ currentPage === 1 }
          onClick={ () => { this.props.onClick(1) }}
        />
        <BSPagination.Prev disabled={ currentPage === 1 }
          onClick={ () => { this.props.onClick(currentPage - 1) }}
        />

        { paginationItems }

        <BSPagination.Next disabled={ currentPage === pageAmount }
          onClick={ () => { this.props.onClick(currentPage + 1) }}
        />
        <BSPagination.Last disabled={ currentPage === pageAmount }
          onClick={ () => { this.props.onClick(pageAmount) }}
        />
        </BSPagination>
      }
      </>
    )
  }
}

export default Pagination;