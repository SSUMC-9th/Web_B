import {Link} from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='bg-gray-100 dark:bg-gray-900 py-6 mt-12'>
            <div className='container mx-auto text-center text-gray-600 dark:text-grat-400'>
                <p>
                    &copy; {new Date().getFullYear()} SpinningSpinning Dolimpan. All rights
                    reserved.
                </p>
                <div className={'flex justify-center space-x-4 mt'}>
                    <Link to={'#'}>Privacy Policy</Link>
                    <Link to={'#'}>Terms of Service</Link>

                    <Link to={'#'}>Contack</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;